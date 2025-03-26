export type RootStackParamList = {
  Home: undefined;
  CardDetail: { cardId: string };
  Favorites: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};

export interface Card {
  id: string;
  expression: string;
  translation: string;
  example: string;
  language: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}
