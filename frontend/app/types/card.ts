export interface CardData {
  id: string;
  text: string;
  meaning: string;
  explanation: string;
  examples: string[];
  frequency_of_use: number;
  category_theme: string[];
  sentiment: string[];
  context_diversity: string[];
  literal_transparency: number;
  translation_difficulty: number;
  depiction: string[];
  alternative_depiction: string[];
  meaning_depiction: string[];
  favorite: boolean;
  upvotes: number;
  downvotes: number;
}

export interface CardProps {
  item: CardData;
  onPress: () => void;
}

const cardTypes = {
  CardData: {} as CardData,
  CardProps: {} as CardProps,
};

export default cardTypes;
