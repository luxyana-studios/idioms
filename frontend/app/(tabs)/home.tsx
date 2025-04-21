import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { CardData } from '../types/card';
import { fetchCards } from '../services/cardService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_HEIGHT = 550;

const Card = ({ item }: { item: CardData }) => {
  const rotation = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const handleFlip = () => {
    rotation.value = withSpring(isFlipped ? 0 : 1, {
      damping: 10,
      stiffness: 100,
    });
    setIsFlipped(!isFlipped);
  };

  return (
    <View className="m-4">
      <TouchableOpacity onPress={handleFlip} activeOpacity={1}>
        <View>
          <Animated.View
            style={[
              {
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: '#221f3d',
                borderRadius: 20,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
              },
              frontAnimatedStyle,
            ]}
          >
            <Text className="text-2xl font-bold text-white">{item.title}</Text>
          </Animated.View>
          <Animated.View
            style={[
              {
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: '#151312',
                borderRadius: 20,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
              },
              backAnimatedStyle,
            ]}
          >
            <Text className="text-lg text-white">{item.content}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Index = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const loadInitialCards = async () => {
    try {
      setLoading(true);
      const initialCards = await fetchCards(1, limit);
      setCards(initialCards);
    } catch (error) {
      console.error('Error loading initial cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreCards = useCallback(async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newCards = await fetchCards(page + 1, limit);
      setCards((prev) => [...prev, ...newCards]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more cards:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  useEffect(() => {
    loadInitialCards();
  }, []);

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            loadMoreCards();
          }
        }}
        scrollEventThrottle={400}
      >
        {cards.map((card) => (
          <Card key={card.id} item={card} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Index;
