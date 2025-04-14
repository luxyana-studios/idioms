import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useState, useCallback } from 'react';
import { Card } from '../../components/Card';

// Simulamos datos de ejemplo
const generateMockData = (page: number) => {
  return Array(10)
    .fill(0)
    .map((_, index) => ({
      id: `${page}-${index}`,
      title: `Título ${page}-${index}`,
      description: `Descripción de la tarjeta ${page}-${index}`,
    }));
};

const Index = () => {
  const [data, setData] = useState(generateMockData(1));
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const loadMoreData = useCallback(() => {
    if (loading) return;
    setLoading(true);
    // Simulamos una llamada a la API
    setTimeout(() => {
      const newData = generateMockData(page + 1);
      setData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  }, [page, loading]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulamos una llamada a la API
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
        contentContainerStyle={{ paddingVertical: 16 }}
        snapToInterval={Dimensions.get('window').height * 0.85 + 16}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;
