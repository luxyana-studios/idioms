import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type CardProps = {
  id: string;
  title: string;
};

const { width, height } = Dimensions.get('window');

export const Card = ({ id, title }: CardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/cards/${id}`);
  };

  return (
    <View className="items-center mb-4">
      <TouchableOpacity
        onPress={handlePress}
        style={{
          height: height * 0.85,
          width: width - 32,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 24,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={['#4c51bf', '#667eea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              padding: 24,
              borderRadius: 24,
            }}
          >
            <View className="flex-1 justify-center">
              <Text className="text-3xl font-bold text-white text-center">
                {title}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </View>
  );
};
