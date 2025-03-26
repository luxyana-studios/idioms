import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useFirebaseData } from '../hooks/useFirebaseData';
import FlashCard from '../components/FlashCard';
import { Idiom } from '../types/cardTypes';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { idioms, loading } = useFirebaseData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < idioms.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Cargando Idioms...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Idiom Master</Text>
        <Text style={styles.subheaderTitle}>
          Aprende Expresiones Idiomáticas
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <FlashCard
          card={idioms[currentIndex]}
          onFlip={() => {
            /* Lógica adicional si se requiere */
          }}
        />
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextCard}>
          <Text style={styles.nextButtonText}>Siguiente Frase</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {idioms.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#6200EE',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  subheaderTitle: {
    fontSize: 16,
    color: '#666',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  actionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;
