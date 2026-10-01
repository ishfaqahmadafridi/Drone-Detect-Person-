"""
Unit & Integration Tests: Wired Camera Streams (PoE RTSP & USB Hardware).
"""

import unittest
from fastapi.testclient import TestClient
from main import app
from app.services.stream_service import stream_service
from tests.fixtures import MockCameraSocketServer, find_free_port


class TestCameraWiredConnection(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def tearDown(self):
        stream_service.set_source("synthetic", None)

    def test_wired_wall_cctv_poe_rtsp_connection(self):
        """
        Verify Layer 4 reachability, URI synthesis, and source switching for a Wired PoE CCTV camera.
        """
        live_port = find_free_port()
        mock_camera = MockCameraSocketServer(live_port, response_mode="ok")
        mock_camera.start()

        try:
            probe_payload = {
                "source_type": "rtsp",
                "device_type": "wall_cctv",
                "connection_mode": "wired",
                "host": "127.0.0.1",
                "port": live_port,
                "stream_path": "/live",
                "username": "admin",
                "password": "camera_secret_password",
                "transport": "tcp",
            }

            # 1. Test reachability & RTSP handshake via API endpoint
            resp = self.client.post("/api/stream/test-connection", json=probe_payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()

            self.assertTrue(data["success"], f"Probe failed: {data.get('message')}")
            self.assertGreater(data["latency_ms"], 0.0)
            self.assertIn("RTSP stream verified", data["message"])
            expected_url = f"rtsp://admin:camera_secret_password@127.0.0.1:{live_port}/live"
            self.assertEqual(data["effective_url"], expected_url)

            # 2. Switch stream source to this wired camera
            switch_resp = self.client.post("/api/stream/source", json=probe_payload)
            self.assertEqual(switch_resp.status_code, 200)
            switch_data = switch_resp.json()

            self.assertEqual(switch_data["source_type"], "rtsp")
            self.assertEqual(switch_data["effective_url"], expected_url)
            self.assertEqual(switch_data["device_type"], "wall_cctv")
            self.assertEqual(switch_data["connection_mode"], "wired")

        finally:
            mock_camera.stop()

    def test_wired_usb_hardware_resilience(self):
        """
        Verify graceful fallback when configuring a wired USB hardware camera
        that is not physically attached in the test runner.
        """
        payload = {
            "source_type": "webcam",
            "source_path": "999",  # Non-existent device index
            "device_type": "wall_cctv",
            "connection_mode": "wired",
        }

        switch_resp = self.client.post("/api/stream/source", json=payload)
        self.assertEqual(switch_resp.status_code, 200)

        # Frame reader must survive and fall back to procedural simulation without dropping
        ret, frame = stream_service.source_provider.read_frame()
        self.assertTrue(ret)
        self.assertIsNotNone(frame)


if __name__ == "__main__":
    unittest.main()
