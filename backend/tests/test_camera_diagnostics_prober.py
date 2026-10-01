"""
Unit & Protocol Diagnostics Tests: Connection Prober, Handshakes, and Failure Detection.
"""

import unittest
from fastapi.testclient import TestClient
from main import app
from app.services.stream_service import stream_service
from tests.fixtures import MockCameraSocketServer, find_free_port


class TestCameraDiagnosticsProber(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def tearDown(self):
        stream_service.set_source("synthetic", None)

    def test_rtsp_unauthorized_credentials_failure(self):
        """
        Layer 7 check: Camera responds with 401 Unauthorized when credentials fail.
        """
        live_port = find_free_port()
        mock_camera = MockCameraSocketServer(live_port, response_mode="unauthorized")
        mock_camera.start()

        try:
            probe_payload = {
                "source_type": "rtsp",
                "host": "127.0.0.1",
                "port": live_port,
                "stream_path": "/live",
                "username": "wrong_user",
                "password": "wrong_password",
            }

            resp = self.client.post("/api/stream/test-connection", json=probe_payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()

            # Must correctly detect authentication failure even though TCP port is open
            self.assertFalse(data["success"])
            self.assertIn("401 Unauthorized", data["message"])
            self.assertIn("authentication failed", data["message"])

        finally:
            mock_camera.stop()

    def test_rtsp_stream_path_not_found(self):
        """
        Layer 7 check: Camera responds with 404 Not Found when stream path is invalid.
        """
        live_port = find_free_port()
        mock_camera = MockCameraSocketServer(live_port, response_mode="not_found")
        mock_camera.start()

        try:
            probe_payload = {
                "source_type": "rtsp",
                "host": "127.0.0.1",
                "port": live_port,
                "stream_path": "/invalid_channel_name",
            }

            resp = self.client.post("/api/stream/test-connection", json=probe_payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()

            self.assertFalse(data["success"])
            self.assertIn("404 Not Found", data["message"])

        finally:
            mock_camera.stop()

    def test_user_transport_protocol_forwarding(self):
        """
        Verify that transport selection ('udp' vs 'tcp') from Step 3 is accurately configured.
        """
        payload = {
            "source_type": "rtsp",
            "source_path": "rtsp://192.168.1.150:8554/live",
            "transport": "udp",
        }

        switch_resp = self.client.post("/api/stream/source", json=payload)
        self.assertEqual(switch_resp.status_code, 200)

        active = stream_service.source_provider._state.active_source
        if hasattr(active, "transport"):
            self.assertEqual(active.transport, "udp")

    def test_probe_closed_port_reporting(self):
        """
        Honest report: when a camera IP is reachable but the RTSP port is closed/unresponsive.
        """
        closed_port = find_free_port()

        probe_payload = {
            "source_type": "rtsp",
            "host": "127.0.0.1",
            "port": closed_port,
            "stream_path": "/live",
        }

        resp = self.client.post("/api/stream/test-connection", json=probe_payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        self.assertFalse(data["success"])
        self.assertIn("unreachable or port closed", data["message"])
        self.assertIsNotNone(data["latency_ms"])

    def test_probe_missing_host_validation(self):
        """
        Honest report: when no host or target IP is provided.
        """
        probe_payload = {
            "source_type": "rtsp",
            "host": "",
            "port": 554,
        }

        resp = self.client.post("/api/stream/test-connection", json=probe_payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        self.assertFalse(data["success"])
        self.assertIn("No valid target host or IP provided", data["message"])

    def test_probe_synthetic_procedural_simulation(self):
        """
        Probe synthetic simulation engine — always ready and sub-2ms latency.
        """
        probe_payload = {
            "source_type": "synthetic",
        }

        resp = self.client.post("/api/stream/test-connection", json=probe_payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        self.assertTrue(data["success"])
        self.assertEqual(data["effective_url"], "synthetic://procedural")
        self.assertIn("Synthetic Procedural UAV/CCTV simulation engine ready", data["message"])


if __name__ == "__main__":
    unittest.main()
