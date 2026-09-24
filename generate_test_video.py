"""
Synthetic Drone Flight Test Video Generator.
Generates a realistic overhead drone aerial simulation video with moving people,
gathering behavior (2+ people), and restricted zone entry to test detection & alert pipelines.
"""

import argparse
import math
import random
import cv2
import numpy as np

def create_synthetic_drone_video(
    output_path: str = "test_drone.mp4",
    width: int = 1280,
    height: int = 720,
    duration_sec: int = 15,
    fps: int = 25,
    num_people: int = 4
):
    print(f"[INFO] Generating synthetic drone test video: {output_path} ({width}x{height} @ {fps}fps, {duration_sec}s)...")
    total_frames = duration_sec * fps
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    # Define simulated people with positions, velocities, colors, and trajectories
    people = []
    # Palette of shirt colors for simulated people
    colors = [
        (40, 40, 220),   # Red shirt
        (220, 100, 40),  # Blue shirt
        (40, 200, 40),   # Green shirt
        (200, 40, 200),  # Purple shirt
        (30, 200, 230),  # Yellow shirt
        (240, 240, 240), # White shirt
    ]

    for i in range(num_people):
        angle = random.uniform(0, 2 * math.pi)
        speed = random.uniform(1.5, 3.5)
        # Start positions scattered around the perimeter
        people.append({
            'x': random.uniform(100, width - 100),
            'y': random.uniform(100, height - 100),
            'vx': math.cos(angle) * speed,
            'vy': math.sin(angle) * speed,
            'color': colors[i % len(colors)],
            'size': random.randint(18, 24), # Aerial person bounding radius
            'walk_phase': random.uniform(0, math.pi * 2),
            'target_zone_prob': random.uniform(0.3, 0.7)
        })

    # Center zone coords
    zx1, zy1 = int(width * 0.25), int(height * 0.25)
    zx2, zy2 = int(width * 0.75), int(height * 0.75)

    for frame_idx in range(total_frames):
        # 1. Base terrain background (Simulated courtyard pavement & grass border)
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Ground texture with subtle aerial paving pattern
        frame[:, :] = (130, 135, 140) # Concrete courtyard grey
        
        # Grass edges
        cv2.rectangle(frame, (0, 0), (width, 60), (45, 95, 45), -1)
        cv2.rectangle(frame, (0, height - 60), (width, height), (45, 95, 45), -1)
        cv2.rectangle(frame, (0, 0), (60, height), (45, 95, 45), -1)
        cv2.rectangle(frame, (width - 60, 0), (width, height), (45, 95, 45), -1)

        # Subtle drone camera subtle drift / pan simulation
        drift_x = int(math.sin(frame_idx * 0.02) * 8)
        drift_y = int(math.cos(frame_idx * 0.02) * 6)

        # Draw ground grid / parking markers
        for gx in range(120, width - 100, 160):
            cv2.line(frame, (gx + drift_x, 80), (gx + drift_x, height - 80), (160, 165, 170), 2)

        # Draw security restricted zone boundary markings on ground
        cv2.rectangle(frame, (zx1 + drift_x, zy1 + drift_y), (zx2 + drift_x, zy2 + drift_y), (100, 100, 180), 2)
        cv2.putText(frame, "ZONE RESTRICTED AREA", (zx1 + drift_x + 10, zy1 + drift_y + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 100, 180), 1)

        # 2. Update and draw simulated people from top-down / aerial drone angle
        # In frame range 75 - 250, guide people 0 and 1 to walk towards each other in the restricted zone to trigger 2+ gathering!
        for i, p in enumerate(people):
            # Dynamic behavior
            if 60 < frame_idx < 260 and i < 2:
                # Move towards center gathering spot
                target_x = width // 2 + (i * 40 - 20)
                target_y = height // 2
                dx = target_x - p['x']
                dy = target_y - p['y']
                dist = math.hypot(dx, dy)
                if dist > 5:
                    p['vx'] = (dx / dist) * 2.0
                    p['vy'] = (dy / dist) * 2.0
                else:
                    p['vx'] = random.uniform(-0.3, 0.3)
                    p['vy'] = random.uniform(-0.3, 0.3)
            else:
                # Bounce within frame boundaries
                if p['x'] < 100 or p['x'] > width - 100:
                    p['vx'] *= -1
                if p['y'] < 100 or p['y'] > height - 100:
                    p['vy'] *= -1

            p['x'] += p['vx']
            p['y'] += p['vy']
            p['walk_phase'] += 0.2

            px = int(p['x'] + drift_x)
            py = int(p['y'] + drift_y)
            r = p['size']

            # Render overhead person:
            # - Shadow
            cv2.ellipse(frame, (px + 6, py + 8), (r + 4, r // 2), 25, 0, 360, (70, 75, 80), -1)
            # - Torso / shoulders (ellipse)
            cv2.ellipse(frame, (px, py), (r, r // 2 + 2), int(p['walk_phase'] * 10), 0, 360, p['color'], -1)
            # - Head (centered circle)
            cv2.circle(frame, (px, py - 2), r // 2, (30, 20, 15), -1)
            # - Hair / cap
            cv2.circle(frame, (px, py - 4), r // 3, (20, 15, 10), -1)
            # - Arms / hands swinging
            swing = math.sin(p['walk_phase']) * 6
            cv2.circle(frame, (px - r + int(swing), py), 3, (210, 180, 150), -1)
            cv2.circle(frame, (px + r - int(swing), py), 3, (210, 180, 150), -1)

        # 3. Drone Telemetry HUD in corner (Simulated OSD)
        telemetry_y = height - 20
        alt = 24.5 + math.sin(frame_idx * 0.05) * 0.8
        bat = max(10, int(98 - (frame_idx / total_frames) * 8))
        osd_text = f"DRONE TELEMETRY: ALT {alt:.1f}m | SPD 3.2m/s | BAT {bat}% | HDG 184 DEG | GPS 34.0152N, 71.5249E"
        cv2.putText(frame, osd_text, (20, telemetry_y), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)

        out.write(frame)

    out.release()
    print(f"[SUCCESS] Synthetic drone test video saved to: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic drone aerial video for testing")
    parser.add_argument("--output", "-o", type=str, default="test_drone.mp4", help="Output MP4 filepath")
    parser.add_argument("--width", type=int, default=1280, help="Video width")
    parser.add_argument("--height", type=int, default=720, help="Video height")
    parser.add_argument("--duration", "-d", type=int, default=15, help="Duration in seconds")
    parser.add_argument("--fps", type=int, default=25, help="Frames per second")
    parser.add_argument("--num-people", "-n", type=int, default=4, help="Number of simulated people")
    args = parser.parse_args()

    create_synthetic_drone_video(
        output_path=args.output,
        width=args.width,
        height=args.height,
        duration_sec=args.duration,
        fps=args.fps,
        num_people=args.num_people
    )
