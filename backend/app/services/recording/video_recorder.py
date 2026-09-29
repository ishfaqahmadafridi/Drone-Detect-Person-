"""
Video Recorder Service Singleton and Legacy Compatibility Module.
"""

from app.services.recording.recorder import VideoClipRecorder

# Global singleton instance
video_recorder = VideoClipRecorder()

__all__ = ["VideoClipRecorder", "video_recorder"]
