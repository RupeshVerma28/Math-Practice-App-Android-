import { useEffect } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// A compact original WAV tone bundled as a data URI; it never downloads from a network.
const ping = 'data:audio/wav;base64,UklGRpwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXgAAACAg4qSlZCBbFdKS1x7osXa0bSIWzcnLUp1osfZ1LiOYDsnK0ZvncTY1r2UZj4oKkFqmMDX18GZa0IqKD1kkrzV2MSecUcsJzpfjbfT2cikdksuJjZah7PR2supfFAwJjNWgajCyLuhgWRSTldpfpCbnZeMgXp3eX0=';

export function useSound(enabled) {
  useEffect(() => {
    if (enabled) setAudioModeAsync({ playsInSilentMode: true }).catch((error) => console.warn('MathSprint audio mode unavailable:', error?.message));
  }, [enabled]);
  const play = () => {
    if (!enabled) return;
    try {
      const player = createAudioPlayer(ping);
      player.play();
      setTimeout(() => player.remove(), 450);
    } catch (error) {
      console.warn('MathSprint sound unavailable:', error?.message);
    }
  };
  return { play };
}
