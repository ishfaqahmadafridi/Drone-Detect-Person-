"""Prepare pinned source/weights and check CPU or CUDA readiness; never rents compute."""
import argparse
import hashlib
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.core.config import ReIDConfig
from app.core.constants import XTFCLIP_CONFIG, XTFCLIP_REVISION, CLIP_TOKENIZER_PATH, CLIP_TOKENIZER_SHA256
from app.services.reid.assets import install_source, download_checkpoint, sha256


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--install-source", action="store_true", help="Clone the official source at the reviewed revision")
    parser.add_argument("--download-weights", action="store_true", help="Download and verify the official trained checkpoint")
    args = parser.parse_args()
    config = ReIDConfig()
    source = Path(config.source_dir).resolve()
    if args.install_source:
        install_source(source)
    if args.download_weights:
        download_checkpoint(config.checkpoint)
    checks = []
    source_ok = (source / XTFCLIP_CONFIG).is_file()
    checks.append(("Upstream source", source_ok, str(source)))
    tokenizer = source / CLIP_TOKENIZER_PATH
    checks.append(("CLIP tokenizer", tokenizer.is_file() and sha256(tokenizer) == CLIP_TOKENIZER_SHA256,
                   str(tokenizer)))
    if source_ok:
        revision = subprocess.run(["git", "-C", str(source), "rev-parse", "HEAD"], capture_output=True, text=True)
        checks.append(("Reviewed revision", revision.returncode == 0 and revision.stdout.strip() == XTFCLIP_REVISION,
                       revision.stdout.strip() or revision.stderr.strip()))
    weights = Path(config.checkpoint)
    checks.append(("Trained checkpoint", weights.is_file(), str(weights)))
    if weights.is_file():
        with weights.open("rb") as handle:
            digest = hashlib.file_digest(handle, "sha256").hexdigest()
        checks.append(("Checkpoint SHA256", not config.checkpoint_sha256 or digest == config.checkpoint_sha256.lower(), digest))
    checks.append(("Camera mode", config.camera_mode == "neutral" or min(config.ground_camera_id, config.aerial_camera_id) >= 0,
                   f"{config.camera_mode}: ground={config.ground_camera_id}, aerial={config.aerial_camera_id}"))
    try:
        import torch
        device = torch.device(config.device)
        available = device.type == "cpu" or (torch.cuda.is_available() and
                    (device.index or 0) < torch.cuda.device_count())
        detail = torch.cuda.get_device_name(device) if available and device.type == "cuda" else str(device)
        checks.append(("Inference device", available, detail))
    except ImportError:
        checks.append(("PyTorch", False, "Not installed"))
    for package in ("torchvision", "yacs", "timm", "ftfy", "regex"):
        try:
            __import__(package)
            checks.append((package, True, "importable"))
        except Exception as exc:
            checks.append((package, False, str(exc)))
    for name, ok, detail in checks:
        print(f"{'OK' if ok else 'MISSING'} | {name}: {detail}")
    return 0 if all(ok for _, ok, _ in checks) else 1


if __name__ == "__main__":
    raise SystemExit(main())
