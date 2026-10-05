"""
Hardware acceleration device detector for Computer Vision and PyTorch inference.
"""

import os


def get_optimal_device() -> str:
    """
    Selects the optimal execution device for deep learning inference.
    Supports CUDA (NVIDIA GPU), MPS (Apple Silicon GPU), or CPU fallback.
    """
    env_device = os.getenv("DETECTION_DEVICE")
    if env_device:
        return env_device.lower().strip()

    try:
        import torch

        if torch.cuda.is_available():
            return "cuda"

        if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            # Enable MPS fallback to CPU for operations not natively supported in MPS (e.g., torchvision NMS)
            os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")
            return "mps"
    except Exception:
        pass

    return "cpu"
