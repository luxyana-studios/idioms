export interface CardData {
  id: string;
  text: string;
  meaning: string;
  explanation: string;
  examples: string[];
  depiction?: string[];
  isFavorite?: boolean;
}

export interface CardProps {
  item: CardData;
  onPress: () => void;
}
