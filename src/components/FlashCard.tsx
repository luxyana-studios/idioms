import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Idiom } from '../types/cardTypes';

const { width } = Dimensions.get('window');

interface FlashCardProps {
  card: Idiom;
  onFlip?: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ card, onFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip && onFlip();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isFlipped ? styles.flippedCard : styles.unflippedCard,
      ]}
      onPress={handleFlip}
    >
      {!isFlipped ? (
        <Text style={styles.phraseText}>{card.phrase}</Text>
      ) : (
        <View>
          <Text style={styles.meaningTitle}>Significado:</Text>
          <Text style={styles.meaningText}>{card.meaning}</Text>
          <Text style={styles.exampleTitle}>Ejemplo:</Text>
          <Text style={styles.exampleText}>{card.example}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    height: 400,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  unflippedCard: {
    backgroundColor: '#6200EE',
  },
  flippedCard: {
    backgroundColor: '#E6E6FA',
  },
  phraseText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  meaningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 10,
  },
  meaningText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
    marginTop: 10,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default FlashCard;
