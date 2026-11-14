"""Test-wide isolation.

App modules resolve storage paths at import time (app/core/paths.py), and this file is loaded by
pytest before any test module. Pointing every output path at a throwaway directory keeps test
runs from writing snapshots, recordings and evidence rows into the operator's real data.
"""
import atexit
import os
import shutil
import tempfile

_TEST_RUNS_DIR = tempfile.mkdtemp(prefix="aeroguard-tests-")
_OUTPUT_DIR = os.path.join(_TEST_RUNS_DIR, "output")

for key, value in {
    "RUNS_DIR": _TEST_RUNS_DIR,
    "OUTPUT_DIR": _OUTPUT_DIR,
    "SNAPSHOTS_DIR": os.path.join(_OUTPUT_DIR, "snapshots"),
    "RECORDINGS_DIR": os.path.join(_OUTPUT_DIR, "recordings"),
    "LOGS_DIR": os.path.join(_OUTPUT_DIR, "logs"),
    "DATABASE_PATH": os.path.join(_OUTPUT_DIR, "evidence.db"),
}.items():
    os.environ[key] = value  # Deliberately overrides .env: tests must never touch real evidence.

atexit.register(shutil.rmtree, _TEST_RUNS_DIR, ignore_errors=True)
