"""
Renderers package: Modular sub-renderers for the Ground CCTV simulator.

Each module owns one visual layer:
  - background  : sky gradient + warehouse silhouettes
  - perimeter   : security fence, posts, cross-wire
  - courtyard   : perspective ground plane + restricted-zone marking
  - osd_overlay : recording dot, timestamp, camera header, footer
"""

from app.simulator.renderers.background import BackgroundRenderer
from app.simulator.renderers.perimeter import PerimeterRenderer
from app.simulator.renderers.courtyard import CourtyardRenderer
from app.simulator.renderers.osd_overlay import OsdOverlayRenderer

__all__ = [
    "BackgroundRenderer",
    "PerimeterRenderer",
    "CourtyardRenderer",
    "OsdOverlayRenderer",
]
