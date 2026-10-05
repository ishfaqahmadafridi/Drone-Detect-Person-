export interface ReIDCandidate {
  track_key: string;
  track_id: number;
  rank: number;
  similarity: number;
  image: string;
  frame_idx: number;
  seen_at: number;
}

export interface ReIDTarget {
  target_key: string;
  ground_track_id: number;
  image: string;
  samples: number;
  required_samples: number;
  state: "collecting" | "searching" | "candidates" | "no_match";
  candidates: ReIDCandidate[];
}

export interface ReIDStatus {
  status: "disabled" | "idle" | "loading" | "ready" | "error";
  message: string;
  model: string;
  threshold_configured: boolean;
  targets: ReIDTarget[];
  gallery_tracks: number;
  last_inference_ms: number | null;
  generation: number;
}
