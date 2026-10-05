"""Repeatable source/checkpoint provisioning, separate from live inference."""
import hashlib
import subprocess
import urllib.request
from pathlib import Path

from app.core.constants import (
    XTFCLIP_REPOSITORY, XTFCLIP_REVISION, XTFCLIP_DRIVE_FILE_ID,
    XTFCLIP_CHECKPOINT_BYTES, XTFCLIP_CHECKPOINT_SHA256,
    CLIP_TOKENIZER_PATH, CLIP_TOKENIZER_URL, CLIP_TOKENIZER_SHA256,
)


def sha256(path):
    with Path(path).open("rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()


def install_source(directory):
    source = Path(directory).resolve()
    if not source.exists():
        source.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["git", "clone", XTFCLIP_REPOSITORY, str(source)], check=True)
        subprocess.run(["git", "-C", str(source), "checkout", "--detach", XTFCLIP_REVISION], check=True)
    revision = subprocess.run(["git", "-C", str(source), "rev-parse", "HEAD"],
                              capture_output=True, text=True, check=True).stdout.strip()
    if revision != XTFCLIP_REVISION:
        raise RuntimeError(f"Existing source revision is {revision}; expected {XTFCLIP_REVISION}. It was not overwritten.")
    tokenizer = source / CLIP_TOKENIZER_PATH
    if not tokenizer.exists():
        partial = tokenizer.with_suffix(".part")
        urllib.request.urlretrieve(CLIP_TOKENIZER_URL, partial)
        if sha256(partial) != CLIP_TOKENIZER_SHA256:
            raise RuntimeError("CLIP tokenizer checksum mismatch")
        partial.replace(tokenizer)
    if sha256(tokenizer) != CLIP_TOKENIZER_SHA256:
        raise RuntimeError("CLIP tokenizer checksum mismatch")
    return source


def download_checkpoint(destination):
    """Atomic install of the official artifact; do not overwrite a different model."""
    import gdown
    destination = Path(destination).resolve()
    if destination.exists():
        if XTFCLIP_CHECKPOINT_SHA256 and sha256(destination) != XTFCLIP_CHECKPOINT_SHA256:
            raise RuntimeError("Existing checkpoint differs from the official artifact; move it or choose another path.")
        return destination
    destination.parent.mkdir(parents=True, exist_ok=True)
    partial = destination.with_name(destination.name + ".part")
    result = gdown.download(id=XTFCLIP_DRIVE_FILE_ID, output=str(partial), resume=True)
    if result is None or partial.stat().st_size != XTFCLIP_CHECKPOINT_BYTES:
        raise RuntimeError("Checkpoint download is incomplete; rerun --download-weights.")
    if XTFCLIP_CHECKPOINT_SHA256 and sha256(partial) != XTFCLIP_CHECKPOINT_SHA256:
        raise RuntimeError("Downloaded checkpoint failed SHA-256 verification.")
    partial.replace(destination)
    return destination
