"""
Unit & Integration Tests: Wireless Camera Streams (Wi-Fi 5GHz CCTV & Smartphone IP Webcam).
"""

import unittest
from fastapi.testclient import TestClient
from main import app
from app.services.stream_service import stream_service
from tests.fixtures import MockCameraSocketServer, find_free_port


class TestCameraWirelessConnection(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def tearDown(self):
        stream_service.set_source("synthetic", None)

    def test_wireless_wall_cctv_wifi_rtsp_connection(self):
        """
        Verify Wireless Wi-Fi CCTV with username but NO password (common on local security LANs).
        """
        live_port = find_free_port()
        mock_camera = MockCameraSocketServer(live_port, response_mode="ok")
        mock_camera.start()

        try:
            probe_payload = {
                "source_type": "rtsp",
                "device_type": "wall_cctv",
                "connection_mode": "wireless",
                "host": "127.0.0.1",
                "port": live_port,
                "stream_path": "/live",
                "username": "admin",
                "password": "",  # Empty password
                "transport": "tcp",
            }

            resp = self.client.post("/api/stream/test-connection", json=probe_payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()

            self.assertTrue(data["success"])
            self.assertGreater(data["latency_ms"], 0.0)
            expected_url = f"rtsp://admin@127.0.0.1:{live_port}/live"
            self.assertEqual(data["effective_url"], expected_url)

        finally:
            mock_camera.stop()

    def test_wireless_smartphone_ip_webcam_connection(self):
        """
        Verify Wireless Smartphone running IP Webcam (HTTP on port 8080).
        """
        live_port = find_free_port()
        mock_phone = MockCameraSocketServer(live_port, response_mode="ok")
        mock_phone.start()

        try:
            phone_payload = {
                "source_type": "http",
                "device_type": "mobile_phone",
                "connection_mode": "wireless",
                "host": "127.0.0.1",
                "port": live_port,
                "stream_path": "/video",
            }

            # 1. Probe reachability & HTTP handshake
            resp = self.client.post("/api/stream/test-connection", json=phone_payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()

            self.assertTrue(data["success"])
            self.assertGreater(data["latency_ms"], 0.0)
            expected_url = f"http://127.0.0.1:{live_port}/video"
            self.assertEqual(data["effective_url"], expected_url)

            # 2. Switch stream source to this smartphone feed
            switch_resp = self.client.post("/api/stream/source", json=phone_payload)
            self.assertEqual(switch_resp.status_code, 200)
            switch_data = switch_resp.json()

            self.assertEqual(switch_data["source_type"], "http")
            self.assertEqual(switch_data["effective_url"], expected_url)
            self.assertEqual(switch_data["device_type"], "mobile_phone")

        finally:
            mock_phone.stop()


if __name__ == "__main__":
    unittest.main()
