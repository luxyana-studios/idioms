export interface CardData {
  id: number;
  title: string;
  content: string;
  meaning: string;
  explanation: string;
  examples: string;
  isFavorite?: boolean;
  text: string;
}

export interface CardProps {
  item: CardData;
  onPress: () => void;
}
