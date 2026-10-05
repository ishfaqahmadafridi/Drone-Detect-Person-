"""
Unit tests for Generative Aerial Diffusion service and API endpoints.
"""

import unittest
import numpy as np
from fastapi.testclient import TestClient
from main import app
from app.services.generative import (
    AerialDiffusionConfig,
    ImagePreprocessor,
    TacticalPromptEngine,
    AerialDiffusionRunner,
    AerialDiffusionService,
    generative_service,
)


class TestGenerativeService(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_preprocessor_with_numpy_frame(self):
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        img = ImagePreprocessor.load_image(numpy_frame=frame)
        self.assertIsNotNone(img)
        prep = ImagePreprocessor.prepare_for_diffusion(img, target_size=(512, 512))
        self.assertEqual(prep.size, (512, 512))

    def test_tactical_prompt_engine(self):
        prompt = TacticalPromptEngine.build_prompt("surveillance checkpoint", scene_context="North Gate")
        self.assertIn("surveillance checkpoint", prompt)
        self.assertIn("North Gate", prompt)
        self.assertIn("satellite view", prompt)

        neg = TacticalPromptEngine.build_negative_prompt("bad quality")
        self.assertIn("bad quality", neg)
        self.assertIn("blurry", neg)

    def test_service_generative_synthesis(self):
        test_frame = np.full((480, 640, 3), 128, dtype=np.uint8)
        res = generative_service.synthesize_aerial_view(
            numpy_frame=test_frame,
            custom_prompt="test aerial synthesis",
            num_inference_steps=5,
        )
        self.assertTrue(res["success"])
        self.assertIsNotNone(res["aerial_image_url"])
        self.assertIsNotNone(res["aerial_image_path"])
        self.assertGreater(res["generation_time_ms"], 0.0)

    def test_api_generative_endpoint(self):
        # Trigger endpoint using live camera fallback
        response = self.client.post(
            "/api/generative/synthesize-aerial",
            json={
                "prompt": "tactical drone view",
                "num_inference_steps": 10,
                "guidance_scale": 7.5,
            },
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("aerial_image_url", data)
        self.assertIn("device_used", data)


if __name__ == "__main__":
    unittest.main()
