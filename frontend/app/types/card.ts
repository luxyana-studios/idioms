export interface CardData {
  id: string;
  text: string;
  meaning: string;
  explanation: string;
  examples: string[];
  isFavorite?: boolean;
}

export interface CardProps {
  item: CardData;
  onPress: () => void;
}
