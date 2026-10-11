import { useCallback, useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { soundUris } from '../constants/soundAssets';

let audioModeConfigured = false;

export function useSound(enabled = true) {
  const activePlayers = useRef(new Set());

  useEffect(() => {
    if (enabled && !audioModeConfigured) {
      setAudioModeAsync({ playsInSilentMode: true })
        .then(() => {
          audioModeConfigured = true;
        })
        .catch((error) => console.warn('MathSprint audio mode setup:', error?.message));
    }
  }, [enabled]);

  useEffect(() => {
    const players = activePlayers.current;
    return () => {
      players.forEach((player) => {
        try {
          player.remove();
        } catch (_) {}
      });
      players.clear();
    };
  }, []);

  const playTone = useCallback((uri, durationMs = 500) => {
    if (!enabled || !uri) return;
    try {
      const player = createAudioPlayer(uri);
      activePlayers.current.add(player);
      player.play();
      setTimeout(() => {
        try {
          player.remove();
        } catch (_) {}
        activePlayers.current.delete(player);
      }, durationMs);
    } catch (error) {
      console.warn('MathSprint audio playback error:', error?.message);
    }
  }, [enabled]);

  const playCorrect = useCallback(() => playTone(soundUris.correct, 350), [playTone]);
  const playIncorrect = useCallback(() => playTone(soundUris.incorrect, 350), [playTone]);
  const playComplete = useCallback(() => playTone(soundUris.complete, 650), [playTone]);

  return { playCorrect, playIncorrect, playComplete };
}
