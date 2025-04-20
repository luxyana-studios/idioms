<<<<<<< HEAD
import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const CardDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-2xl font-bold mb-4">Card Details</Text>
          <Text className="text-lg mb-2">ID: {id}</Text>
          <Text className="text-gray-600">
            Here you can display all the specific details of the selected card.
            You can include more information, images, or any other relevant
            content.
          </Text>
        </View>
      </View>
    </ScrollView>
=======
import { View, Text } from 'react-native';
import React from 'react';

const CardDetails = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-blue-500 font-bold">Card Details</Text>
    </View>
>>>>>>> 993dc868 (Reset git repository to remove 89MB of data)
  );
};

export default CardDetails;
