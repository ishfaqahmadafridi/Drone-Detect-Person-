"""Requests for an operator's frozen-frame selection session."""
from pydantic import BaseModel, Field


class SelectionCommitRequest(BaseModel):
    token: str
    selected_ids: list[int] = Field(default_factory=list)


class SelectionCancelRequest(BaseModel):
    token: str
