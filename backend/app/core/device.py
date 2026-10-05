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
    except Exception:
        pass

    return "cpu"
