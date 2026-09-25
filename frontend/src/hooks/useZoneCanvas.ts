import { useState, useEffect, useCallback, RefObject } from "react";
import { DEFAULT_RESTRICTED_ZONE } from "@/constants/tactical";

interface UseZoneCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isEditingZone: boolean;
  initialPolygon?: [number, number][];
  onSaveZone: (points: [number, number][]) => Promise<void>;
}

export const useZoneCanvas = ({
  canvasRef,
  isEditingZone,
  initialPolygon,
  onSaveZone,
}: UseZoneCanvasProps) => {
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>(
    initialPolygon && initialPolygon.length >= 3 ? initialPolygon : DEFAULT_RESTRICTED_ZONE
  );
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const syncPolygon = useCallback((points?: [number, number][]) => {
    if (points && points.length >= 3) {
      setCurrentPoints(points);
    }
  }, []);

  // Draw overlay canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!isEditingZone) return;

    const w = canvas.width;
    const h = canvas.height;

    // Draw polygon
    if (currentPoints.length >= 2) {
      ctx.beginPath();
      const p0 = currentPoints[0];
      ctx.moveTo(p0[0] * w, p0[1] * h);
      for (let i = 1; i < currentPoints.length; i++) {
        const pt = currentPoints[i];
        ctx.lineTo(pt[0] * w, pt[1] * h);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 242, 254, 0.2)";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#00f2fe";
      ctx.stroke();
    }

    // Draw handles
    currentPoints.forEach((pt, idx) => {
      const px = pt[0] * w;
      const py = pt[1] * h;

      ctx.beginPath();
      ctx.arc(px, py, 8, 0, 2 * Math.PI);
      ctx.fillStyle = idx === draggingIdx ? "#ef4444" : "#00f2fe";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px JetBrains Mono";
      ctx.fillText(`P${idx + 1}`, px + 10, py - 6);
    });
  }, [canvasRef, isEditingZone, currentPoints, draggingIdx]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditingZone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const threshold = 0.04;
    const hitIdx = currentPoints.findIndex(
      (pt) => Math.hypot(pt[0] - x, pt[1] - y) < threshold
    );

    if (hitIdx !== -1) {
      setDraggingIdx(hitIdx);
    } else if (currentPoints.length < 8) {
      const next = [...currentPoints, [x, y] as [number, number]];
      setCurrentPoints(next);
      setDraggingIdx(next.length - 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditingZone || draggingIdx === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const updated = [...currentPoints];
    updated[draggingIdx] = [x, y];
    setCurrentPoints(updated);
  };

  const handleMouseUp = () => {
    setDraggingIdx(null);
  };

  const saveZone = async () => {
    if (currentPoints.length >= 3) {
      await onSaveZone(currentPoints);
    }
  };

  const resetZone = async () => {
    setCurrentPoints(DEFAULT_RESTRICTED_ZONE);
    await onSaveZone(DEFAULT_RESTRICTED_ZONE);
  };

  return {
    currentPoints,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    saveZone,
    resetZone,
    syncPolygon,
  };
};
