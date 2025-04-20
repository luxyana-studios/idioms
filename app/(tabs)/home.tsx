import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useState, useCallback } from 'react';
import { Card } from '@/components/Card';

// Constants for card dimensions and spacing
const CARD_HEIGHT_PERCENTAGE = 0.85; // Card takes 85% of screen height
const CARD_SPACING = 16; // 16px spacing between cards

type MockData = {
  id: string;
  title: string;
};

// Mock data generation
const generateMockData = (page: number): MockData[] => {
  const mockData: MockData[] = [];
  for (let i = 0; i < 10; i++) {
    mockData.push({
      id: `${page}-${i}`,
      title: `Title ${page}-${i}`,
    });
  }
  return mockData;
};

const Index = () => {
  const [data, setData] = useState<MockData[]>(generateMockData(1));
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const loadMoreData = useCallback(() => {
    if (loading) return;
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const newData = generateMockData(page + 1);
      setData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  }, [page, loading]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulating API call
    setTimeout(() => {
      setData(generateMockData(1));
      setPage(1);
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  // Calculate the snap interval based on card height and spacing
  const snapInterval =
    Dimensions.get('window').height * CARD_HEIGHT_PERCENTAGE + CARD_SPACING;

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={data}
        renderItem={({ item }) => <Card id={item.id} title={item.title} />}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingVertical: CARD_SPACING }}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
