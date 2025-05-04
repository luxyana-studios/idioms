export interface CardData {
  id: number;
  title: string;
  content: string;
  isFavorite?: boolean;
}

export interface CardProps {
  item: CardData;
  onPress: () => void;
}
