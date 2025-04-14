import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const CardDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-2xl font-bold mb-4">
            Detalles de la Tarjeta
          </Text>
          <Text className="text-lg mb-2">ID: {id}</Text>
          <Text className="text-gray-600">
            Aquí puedes mostrar todos los detalles específicos de la tarjeta
            seleccionada. Puedes incluir más información, imágenes, o cualquier
            otro contenido relevante.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CardDetails;
