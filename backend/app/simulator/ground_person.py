"""
ground_person.py — Backward-compatible re-export shim.

Logic has been split into app.simulator.persons sub-package:
  - persons/ground_physics.py → GroundPedestrianPhysics
  - persons/ground_body.py    → GroundBodyRenderer
  - persons/ground_person.py  → GroundSimulatedPerson

Import directly from app.simulator.persons for new code.
"""

from app.simulator.persons.ground_person import GroundSimulatedPerson  # noqa: F401

__all__ = ["GroundSimulatedPerson"]
