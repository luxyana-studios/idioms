import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { MotiView } from 'moti';

interface ModernPandaAnimationProps {
  width?: number;
  height?: number;
  style?: object;
}

const ModernPandaAnimation: React.FC<ModernPandaAnimationProps> = ({
  width = 120,
  height = 120,
  style = {},
}) => {
  const player = useVideoPlayer(
    require('../../assets/animations/panda-animation.mp4'),
    (player) => {
      player.loop = true;
      player.play();
      player.muted = true;
    },
  );

  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: 'timing',
        duration: 1000,
      }}
      style={[styles.container, style]}
      pointerEvents="none"
    >
      <VideoView
        style={[styles.video, { width, height }]}
        player={player}
        contentFit="contain"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        showsTimecodes={false}
        requiresLinearPlayback={false}
        pointerEvents="none"
        nativeControls={false}
      />
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    backgroundColor: 'transparent',
  },
});

export default ModernPandaAnimation;
