import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@idioms:favorites';

export const getFavorites = async (): Promise<number[]> => {
  try {
    const favoritesString = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesString ? JSON.parse(favoritesString) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const toggleFavorite = async (id: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

export const isFavorite = async (id: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(id);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};
