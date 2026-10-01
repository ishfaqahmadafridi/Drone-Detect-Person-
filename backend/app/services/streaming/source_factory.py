"""
SourceFactory: Single-responsibility factory for constructing BaseFrameSource instances.

Decouples source construction logic from StreamSourceProvider's lifecycle management.
All source-type routing lives here — StreamSourceProvider only calls build().
"""

from app.services.streaming.sources import (
    BaseFrameSource,
    DeviceFrameSource,
    HttpFrameSource,
    SyntheticFrameSource,
)


class SourceFactory:
    """
    Constructs the correct BaseFrameSource implementation given a source type and path.

    Privacy enforcement: 'webcam' type with device id '0' (local PC webcam) is blocked
    and falls through to the synthetic simulation source.

    Args:
        fallback_source: Pre-constructed synthetic fallback (shared instance).
        http_timeout   : Connection timeout for HTTP/RTSP sources (seconds).
        max_frame_width: Maximum width for HTTP-sourced frames (pixel cap).
        blocked_device : Device ID string that is blocked by privacy policy.
    """

    def __init__(
        self,
        fallback_source: SyntheticFrameSource,
        http_timeout: float = 2.5,
        max_frame_width: int = 1280,
        blocked_device: str = "0",
    ) -> None:
        self._fallback = fallback_source
        self._http_timeout = http_timeout
        self._max_frame_width = max_frame_width
        self._blocked_device = blocked_device

    def build(self, source_type: str, source_path: str, transport: str = "tcp") -> tuple[BaseFrameSource, str]:
        """
        Construct the appropriate frame source.

        Returns:
            (source_instance, effective_source_type) — type may be overridden to
            'synthetic' when a privacy or availability constraint is triggered.
        """
        if source_type == "synthetic":
            return self._fallback, "synthetic"

        if source_type == "webcam":
            return self._build_webcam(source_path)

        if isinstance(source_path, str) and (
            source_path.startswith("http://") or source_path.startswith("https://")
        ):
            return self._build_http(source_path)

        # File or RTSP path — delegate to DeviceFrameSource (handles both)
        return DeviceFrameSource(source_path=source_path, transport=transport), source_type

    # ------------------------------------------------------------------
    # Private builders
    # ------------------------------------------------------------------

    def _build_webcam(self, source_path: str) -> tuple[BaseFrameSource, str]:
        """Block local PC webcam (device 0); allow explicitly provided external devices."""
        if not source_path or str(source_path) == self._blocked_device:
            print(
                "[SOURCE_FACTORY] Local PC/laptop webcam device "
                f"'{self._blocked_device}' blocked by privacy policy — "
                "using simulation fallback."
            )
            return self._fallback, "synthetic"
        return DeviceFrameSource(source_path=source_path), "webcam"

    def _build_http(self, url: str) -> tuple[BaseFrameSource, str]:
        return (
            HttpFrameSource(
                url=url,
                timeout_seconds=self._http_timeout,
                max_width=self._max_frame_width,
            ),
            "http",
        )
