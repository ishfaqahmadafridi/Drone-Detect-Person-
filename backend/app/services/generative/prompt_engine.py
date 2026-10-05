"""
Tactical Prompt Engine: Generates specialized aerial perspective conditioning prompts.
"""

from typing import Optional


class TacticalPromptEngine:
    """
    Constructs and cleans tactical text prompts for ground-to-aerial translation.
    """

    AERIAL_STYLE_SUFFIX = (
        "top-down orthographic satellite view, high-altitude drone surveillance gimbal, "
        "bird's-eye view, military reconnaissance perspective, ultra-sharp detail, 8k aerial photography"
    )

    DEFAULT_NEGATIVE_PROMPT = (
        "blurry, low quality, distorted horizon, street-level ground camera, tilted perspective, "
        "fisheye lens distortion, CGI, rendering artifacts, text, watermark"
    )

    @classmethod
    def build_prompt(cls, user_prompt: Optional[str] = None, scene_context: Optional[str] = None) -> str:
        """
        Combines user intent, scene telemetry context, and aerial style tokens.
        """
        parts = []
        if user_prompt and user_prompt.strip():
            parts.append(user_prompt.strip())
        else:
            parts.append("an aerial overhead drone surveillance view of the perimeter security zone")

        if scene_context and scene_context.strip():
            parts.append(f"featuring {scene_context.strip()}")

        parts.append(cls.AERIAL_STYLE_SUFFIX)
        return ", ".join(parts)

    @classmethod
    def build_negative_prompt(cls, custom_negative: Optional[str] = None) -> str:
        """
        Returns the sanitized negative prompt to suppress artifacts.
        """
        if custom_negative and custom_negative.strip():
            return f"{custom_negative.strip()}, {cls.DEFAULT_NEGATIVE_PROMPT}"
        return cls.DEFAULT_NEGATIVE_PROMPT
