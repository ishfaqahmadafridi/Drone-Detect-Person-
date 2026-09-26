export async function modelStatus() {
  const response = await fetch('/api/health', { signal: AbortSignal.timeout(5000), cache: 'no-store' });
  if (!response.ok) throw new Error('The local inference server is offline.');
  return response.json();
}

export async function detectFrame(view, frameId, blob, { imgsz = 640, confidence = .25, signal } = {}) {
  const params = new URLSearchParams({ frame_id: frameId, imgsz, confidence });
  const response = await fetch(`/api/detect/${view}?${params}`, {
    method: 'POST', headers: { 'Content-Type': blob.type }, body: blob, signal,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(typeof result.detail === 'string' ? result.detail : 'The detection request was rejected.');
  if (result.frame_id !== frameId || result.view !== view) throw new Error('The model returned an unexpected frame identifier.');
  return result;
}
