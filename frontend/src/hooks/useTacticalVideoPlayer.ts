"use client";

import { useRef, useState, useEffect, useCallback } from "react";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function useTacticalVideoPlayer(url?: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setHasError(false);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [url]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsPlaying(false);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleStop = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  const handleSkip = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds)
    );
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const cycleSpeed = useCallback(() => {
    const speeds = [0.5, 1, 1.5, 2];
    setPlaybackRate((prevRate) => {
      const nextIdx = (speeds.indexOf(prevRate) + 1) % speeds.length;
      const nextSpeed = speeds[nextIdx];
      if (videoRef.current) {
        videoRef.current.playbackRate = nextSpeed;
      }
      return nextSpeed;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  }, []);

  // Global hotkeys (Space to toggle, Left/Right arrow to seek)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handleSkip(-5);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleSkip(5);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, handleSkip]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    videoRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    progressPercent,
    isMuted,
    isLooping,
    setIsLooping,
    playbackRate,
    hasError,
    handleError,
    formattedCurrent: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    handleTimeUpdate,
    handleLoadedMetadata,
    togglePlay,
    handleStop,
    handleSkip,
    handleSeek,
    toggleMute,
    cycleSpeed,
    toggleFullscreen,
  };
}

export default useTacticalVideoPlayer;
