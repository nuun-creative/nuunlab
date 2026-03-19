"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playlist, type Track } from "@/data/playlist";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AudioState {
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  hasError: boolean;
}

export interface AudioControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  goToTrack: (index: number) => void;
}

export interface AudioPlayer {
  state: AudioState;
  controls: AudioControls;
  currentTrack: Track;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAudioPlayer(): AudioPlayer {
  const audioRef     = useRef<HTMLAudioElement | null>(null);
  /**
   * shouldPlayRef tracks intent — true means "keep playing across track changes".
   * It is set by play()/pause() and persists across re-renders without causing them.
   * The track-change effect uses it to decide whether to auto-play the incoming track.
   */
  const shouldPlayRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolumeState]  = useState(0.8);
  const [isLoading,    setIsLoading]    = useState(false);
  const [hasError,     setHasError]     = useState(false);

  // ── Initialise audio element once (client-only) ──────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume     = 0.8;
    audio.preload    = "metadata";
    audioRef.current = audio;

    // Preload metadata for the first track so duration is available early
    audio.src = playlist[0].src;
    audio.load();

    const onTimeUpdate     = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(isFinite(audio.duration) ? audio.duration : 0);
      setIsLoading(false);
      setHasError(false);
    };
    const onEnded = () => {
      // Auto-advance; shouldPlayRef stays true so the next track plays
      setCurrentIndex((i) => (i + 1) % playlist.length);
    };
    const onError = () => {
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
      shouldPlayRef.current = false;
    };
    const onWaiting  = () => setIsLoading(true);
    const onPlaying  = () => { setIsPlaying(true); setIsLoading(false); setHasError(false); };
    const onPause    = () => setIsPlaying(false);
    const onLoadStart = () => setIsLoading(true);

    audio.addEventListener("timeupdate",     onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended",          onEnded);
    audio.addEventListener("error",          onError);
    audio.addEventListener("waiting",        onWaiting);
    audio.addEventListener("playing",        onPlaying);
    audio.addEventListener("pause",          onPause);
    audio.addEventListener("loadstart",      onLoadStart);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // ── Load new track whenever currentIndex changes ─────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
    setIsLoading(true);

    audio.src = playlist[currentIndex].src;
    audio.load();

    if (shouldPlayRef.current) {
      audio.play().catch(() => {
        setIsPlaying(false);
        shouldPlayRef.current = false;
      });
    }
  }, [currentIndex]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    shouldPlayRef.current = true;
    audio.play().catch(() => {
      setIsPlaying(false);
      shouldPlayRef.current = false;
    });
  }, []);

  const pause = useCallback(() => {
    shouldPlayRef.current = false;
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % playlist.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + playlist.length) % playlist.length);
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
    setVolumeState(v);
  }, []);

  const goToTrack = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) setCurrentIndex(index);
  }, []);

  return {
    state:    { currentIndex, isPlaying, currentTime, duration, volume, isLoading, hasError },
    controls: { play, pause, toggle, next, prev, seek, setVolume, goToTrack },
    currentTrack: playlist[currentIndex],
  };
}
