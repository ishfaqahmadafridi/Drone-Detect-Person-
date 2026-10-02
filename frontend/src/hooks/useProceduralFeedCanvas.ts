import { useEffect } from "react";
import { UseProceduralFeedCanvasProps } from "@/types";
import { TACTICAL_FEED_PREVIEW_TOKENS } from "@/constants/tactical";

export const useProceduralFeedCanvas = ({
  canvasRef,
  viewMode,
  isActive,
  channelNum = "CH-01",
}: UseProceduralFeedCanvasProps) => {
  useEffect(() => {
    // Only run procedural canvas rendering if not the active live MJPEG stream
    if (isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tokens = TACTICAL_FEED_PREVIEW_TOKENS;
    let animId: number;
    let scanlineY = 0;
    let tick = 0;

    const render = () => {
      tick += 1;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Dark Tactical Background & Ambient Grid
      ctx.fillStyle = tokens.colors.background;
      ctx.fillRect(0, 0, w, h);

      // Grid Pattern
      ctx.strokeStyle = tokens.colors.grid;
      ctx.lineWidth = 1;
      const gridSize = tokens.gridSize;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Sensor Specific Procedural Perspective
      if (viewMode === "ground") {
        // Perspective road/perimeter lines
        ctx.strokeStyle = tokens.colors.groundHorizon;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h);
        ctx.lineTo(w * 0.45, h * 0.35);
        ctx.lineTo(w * 0.55, h * 0.35);
        ctx.lineTo(w * 0.9, h);
        ctx.stroke();

        // Perimeter barrier horizontal wireframes
        ctx.strokeStyle = tokens.colors.groundWireframe;
        for (let i = 1; i <= 3; i++) {
          const py = h * 0.35 + (h * 0.65 * i) / 4;
          ctx.beginPath();
          ctx.moveTo(w * (0.45 - i * 0.08), py);
          ctx.lineTo(w * (0.55 + i * 0.08), py);
          ctx.stroke();
        }

        // Simulated target bounding box in sector
        const targetX = w * 0.48 + Math.sin(tick * 0.03) * (w * 0.15);
        const targetY = h * 0.45 + Math.cos(tick * 0.02) * (h * 0.08);
        const bw = 32;
        const bh = 56;

        ctx.strokeStyle = tokens.colors.targetBox;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(targetX - bw / 2, targetY - bh / 2, bw, bh);

        // Target Tag Label
        ctx.fillStyle = tokens.colors.targetLabelBg;
        ctx.fillRect(targetX - bw / 2, targetY - bh / 2 - 12, bw + 18, 12);
        ctx.font = tokens.typography.tagFont;
        ctx.fillStyle = tokens.colors.targetLabelText;
        ctx.fillText(`TRK-${channelNum.slice(-2)} 0.92`, targetX - bw / 2 + 2, targetY - bh / 2 - 3);
      } else {
        // Aerial top-down tactical circle radar sweeps
        const cx = w / 2;
        const cy = h / 2;
        ctx.strokeStyle = tokens.colors.aerialRadar;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, h * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, h * 0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Compass crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy);
        ctx.lineTo(cx + 30, cy);
        ctx.moveTo(cx, cy - 30);
        ctx.lineTo(cx, cy + 30);
        ctx.stroke();
      }

      // 3. Scanline Animation
      scanlineY = (scanlineY + tokens.scanlineSpeed) % h;
      ctx.strokeStyle = tokens.colors.scanline;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanlineY);
      ctx.lineTo(w, scanlineY);
      ctx.stroke();

      // 4. Optical Corner Brackets
      ctx.strokeStyle = tokens.colors.brackets;
      ctx.lineWidth = 2;
      const bLen = tokens.cornerBracketLength;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(8, 8 + bLen);
      ctx.lineTo(8, 8);
      ctx.lineTo(8 + bLen, 8);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(w - 8 - bLen, 8);
      ctx.lineTo(w - 8, 8);
      ctx.lineTo(w - 8, 8 + bLen);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(8, h - 8 - bLen);
      ctx.lineTo(8, h - 8);
      ctx.lineTo(8 + bLen, h - 8);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(w - 8 - bLen, h - 8);
      ctx.lineTo(w - 8, h - 8);
      ctx.lineTo(w - 8, h - 8 - bLen);
      ctx.stroke();

      // 5. Monospace Live Timestamp Watermark
      const now = new Date();
      const timeStr = now.toISOString().replace("T", " ").substring(0, 19);
      ctx.font = tokens.typography.timestampFont;
      ctx.fillStyle = tokens.colors.timestamp;
      ctx.fillText(timeStr, 12, h - 12);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [canvasRef, isActive, viewMode, channelNum]);
};

export default useProceduralFeedCanvas;
