import { Audio } from 'expo-av';

export const playAudio = async (audioUrl: string) => {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    await sound.playAsync();
  } catch (error) {
    console.error('Error playing audio:', error);
  }
};
