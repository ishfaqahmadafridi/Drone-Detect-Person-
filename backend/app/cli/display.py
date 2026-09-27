"""
CLI Display Manager: GUI window management and interactive keyboard event handler.
"""

import os
import cv2
import numpy as np

class StreamDisplayManager:
    """
    Handles interactive GUI window display, manual snapshots, and keyboard events.
    """
    def __init__(self, window_title: str = "AERO-GUARD Drone Aerial Monitor", headless: bool = False):
        self.window_title = window_title
        self.headless = headless

    def show_frame(self, frame: np.ndarray, frame_idx: int, snapshots_dir: str) -> bool:
        """
        Displays frame and handles key events.
        
        Returns:
            bool: True to continue processing, False if user pressed 'q' to stop.
        """
        if self.headless:
            return True

        try:
            cv2.imshow(self.window_title, frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                print("[INFO] Processing stopped by user ('q').")
                return False
            elif key == ord('s'):
                manual_path = os.path.join(snapshots_dir, f"manual_snap_{frame_idx}.jpg")
                cv2.imwrite(manual_path, frame)
                print(f"[INFO] Manual snapshot captured: {manual_path}")
        except Exception:
            # Headless fallback if graphical display environment is unavailable
            pass

        return True

    def close(self) -> None:
        if not self.headless:
            try:
                cv2.destroyAllWindows()
            except Exception:
                pass
