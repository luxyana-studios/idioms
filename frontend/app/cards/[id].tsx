import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function CardDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View className="flex-1 justify-center items-center p-4">
        <Text style={{ color: colors.text }} className="text-lg">
          Card Detail: {id}
        </Text>
        <Text style={{ color: colors.textSecondary }} className="mt-2">
          This page will show details for card {id}
        </Text>
      </View>
    </View>
  );
}
