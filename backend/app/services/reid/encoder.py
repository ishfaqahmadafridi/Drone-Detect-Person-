"""CPU/CUDA adapter for the pinned research model; imported in a dedicated process.

No dataset loaders, biometric-label masking, training or implicit weight downloads.
The full checkpoint is loaded strictly so random/unloaded layers cannot produce matches.
"""
import hashlib
import sys
from pathlib import Path

import numpy as np
from app.core.constants import XTFCLIP_CONFIG, XTFCLIP_PIXEL_MEAN, XTFCLIP_PIXEL_STD


class XTFCLIPEncoder:
    def __init__(self, settings):
        import torch
        from torch import nn

        self.torch = torch
        self.settings = settings
        self.device = torch.device(settings.device)
        if self.device.type == "cuda":
            if not torch.cuda.is_available():
                raise RuntimeError("CUDA is unavailable. Set REID_DEVICE=cpu or install CUDA PyTorch on a GPU server.")
            torch.cuda.set_device(self.device)
        else:
            torch.set_num_threads(settings.cpu_threads)
        source = Path(settings.source_dir).resolve()
        weights = Path(settings.checkpoint).resolve()
        if not (source / XTFCLIP_CONFIG).is_file():
            raise RuntimeError("X-TFCLIP source missing. Run scripts/setup_reid.py --install-source.")
        if not weights.is_file():
            raise RuntimeError("X-TFCLIP checkpoint missing. Set REID_CHECKPOINT to the official trained weights.")
        if settings.checkpoint_sha256:
            with weights.open("rb") as handle:
                digest = hashlib.file_digest(handle, "sha256").hexdigest()
            if digest.lower() != settings.checkpoint_sha256.lower():
                raise RuntimeError("X-TFCLIP checkpoint checksum mismatch")
        if settings.camera_mode == "mapped" and min(settings.ground_camera_id, settings.aerial_camera_id) < 0:
            raise RuntimeError("Set REID_GROUND_CAMERA_ID and REID_AERIAL_CAMERA_ID from the checkpoint's camera metadata.")

        # This is an isolated process: upstream's generic 'model'/'config' packages
        # cannot shadow backend modules or detection dependencies.
        sys.path.insert(0, str(source))
        from config import cfg
        from model import make_model_clipreid as upstream
        from model.clip.model_video_embed_bicubic import VisionTransformer

        payload = torch.load(weights, map_location="cpu", weights_only=True)
        state = payload.get("state_dict", payload.get("model", payload))
        if not isinstance(state, dict):
            raise RuntimeError("Expected an X-TFCLIP state dictionary")
        state = {key.removeprefix("module."): value for key, value in state.items()}
        camera_count = state["cv_embed"].shape[0]
        classes = state["classifier2.weight"].shape[0]
        if settings.camera_mode == "mapped" and max(settings.ground_camera_id, settings.aerial_camera_id) >= camera_count:
            raise RuntimeError(f"Camera labels must be smaller than the checkpoint's {camera_count} camera embeddings")
        if state["video_embed"].shape[0] != settings.sequence_length:
            raise RuntimeError("REID_SEQUENCE_LENGTH does not match checkpoint video embeddings")
        config = cfg.clone()
        config.merge_from_file(str(source / XTFCLIP_CONFIG))
        config.INPUT.SIZE_TRAIN = [settings.crop_height, settings.crop_width]
        config.INPUT.SIZE_TEST = [settings.crop_height, settings.crop_width]
        config.INPUT.SEQ_LEN = settings.sequence_length
        config.TEST.NECK_FEAT = "before"

        # Upstream first downloads a base CLIP model, then overwrites its visual
        # weights with the trained checkpoint. Construct that exact visual module
        # directly to avoid another large download. Strict loading below is required.
        selected_device = self.device

        class VisualContainer(nn.Module):
            def to(self, *args, **kwargs):
                # Upstream hardcodes clip_model.to('cuda'). Scope the correction
                # to this temporary container; never monkeypatch torch globally.
                return super().to(selected_device)

        def visual_factory(name, height, width, stride):
            if name != "ViT-B-16":
                raise RuntimeError("Only the published ViT-B-16 checkpoint is supported")
            visual_width = state["image_encoder.conv1.weight"].shape[0]
            patch = state["image_encoder.conv1.weight"].shape[-1]
            layers = sum(key.startswith("image_encoder.transformer.resblocks.") and
                         key.endswith("attn.in_proj_weight") for key in state)
            wrapper = VisualContainer()
            wrapper.visual = VisionTransformer(height, width, patch, stride, visual_width,
                                               layers, visual_width // 64,
                                               state["image_encoder.proj"].shape[1])
            return wrapper

        original_factory = upstream.load_clip_to_cpu
        upstream.load_clip_to_cpu = visual_factory
        try:
            self.model = upstream.make_model(config, classes, camera_count, 1)
        finally:
            upstream.load_clip_to_cpu = original_factory
        self.model.load_state_dict(state, strict=True)
        self.model = self.model.float().to(self.device).eval()
        if settings.camera_mode == "neutral":
            # New cameras have no known training-camera label. Omit only the
            # camera-specific offset; retain the learned video-frame embeddings.
            # This is an explicit deployment adaptation, not benchmark reproduction.
            def neutral_camera(module, inputs):
                return (inputs[0], torch.zeros_like(inputs[1]), *inputs[2:])
            self.model.image_encoder.register_forward_pre_hook(neutral_camera)
        self.mean = torch.tensor(XTFCLIP_PIXEL_MEAN, device=self.device).view(1, 1, 3, 1, 1)
        self.std = torch.tensor(XTFCLIP_PIXEL_STD, device=self.device).view(1, 1, 3, 1, 1)

    def encode(self, sequences, channels):
        torch = self.torch
        if any(channel not in {"ground", "aerial"} for channel in channels):
            raise ValueError("Unknown ReID camera channel")
        if len(sequences) != len(channels) or not sequences:
            raise ValueError("Provide one channel for each nonempty sequence")
        camera_ids = ([0] * len(channels) if self.settings.camera_mode == "neutral" else
                      [self.settings.ground_camera_id if channel == "ground"
                       else self.settings.aerial_camera_id for channel in channels])
        array = np.stack(sequences)  # B,T,H,W,C; RGB uint8 from crops.py
        tensor = torch.from_numpy(array).to(self.device, dtype=torch.float32).permute(0, 1, 4, 2, 3) / 255.0
        tensor = (tensor - self.mean) / self.std
        labels = torch.tensor(camera_ids, device=self.device, dtype=torch.long)
        with torch.inference_mode():
            features = self.model(tensor, cam_label=labels)
            if self.settings.flip_augmentation:
                features = (features + self.model(tensor.flip(-1), cam_label=labels)) / 2
            features = torch.nn.functional.normalize(features.float(), dim=1)
        return features.cpu().numpy()
