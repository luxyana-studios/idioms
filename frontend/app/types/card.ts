export interface CardData {
  id: number;
  title: string;
  content: string;
}

export interface CardProps {
  item: CardData;
  onPress: () => void;
}
