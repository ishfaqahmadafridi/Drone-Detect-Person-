"""A single spawned CPU/CUDA process with timeout and no frame backlog."""
import multiprocessing
import threading


def _serve(connection, settings):
    try:
        from app.services.reid.encoder import XTFCLIPEncoder
        encoder = XTFCLIPEncoder(settings)
        connection.send((True, None))
        while True:
            request = connection.recv()
            if request is None:
                break
            sequences, channels = request
            connection.send((True, encoder.encode(sequences, channels)))
    except (EOFError, BrokenPipeError):
        pass
    except Exception as exc:
        try:
            connection.send((False, f"{type(exc).__name__}: {exc}"))
        except (EOFError, BrokenPipeError):
            pass
    finally:
        connection.close()


class ModelWorker:
    def __init__(self, settings):
        self.settings = settings
        self.process = None
        self.connection = None
        self._lifecycle_lock = threading.Lock()

    def _receive(self):
        connection = self.connection
        if not connection.poll(self.settings.worker_timeout_seconds):
            raise RuntimeError("X-TFCLIP worker timed out. Check device memory, workload and dependencies, then retry.")
        success, result = connection.recv()
        if not success:
            raise RuntimeError(result)
        return result

    def start(self):
        with self._lifecycle_lock:
            context = multiprocessing.get_context("spawn")
            self.connection, child = context.Pipe()
            self.process = context.Process(target=_serve, args=(child, self.settings), daemon=True, name="xtfclip")
            self.process.start()
            child.close()
        self._receive()

    def encode(self, sequences, channels):
        self.connection.send((sequences, channels))
        return self._receive()

    def close(self):
        with self._lifecycle_lock:
            if self.process is not None:
                if self.process.is_alive():
                    self.process.terminate()
                self.process.join(timeout=2)
            if self.connection is not None:
                self.connection.close()
            self.process = self.connection = None
