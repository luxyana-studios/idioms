import { useState, useEffect } from 'react';
import { PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

const useCardGestures = () => {
    const [gestureState, setGestureState] = useState({
        translateX: 0,
        translateY: 0,
        isSwiping: false,
    });

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            setGestureState({ ...gestureState, isSwiping: true });
        },
        onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
            setGestureState({
                translateX: gestureState.dx,
                translateY: gestureState.dy,
                isSwiping: true,
            });
        },
        onPanResponderRelease: () => {
            setGestureState({ translateX: 0, translateY: 0, isSwiping: false });
        },
        onPanResponderTerminate: () => {
            setGestureState({ translateX: 0, translateY: 0, isSwiping: false });
        },
    });

    return {
        gestureState,
        panResponder,
    };
};

export default useCardGestures;