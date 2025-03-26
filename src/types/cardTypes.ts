export interface Idiom {
  id: string;
  phrase: string;
  meaning: string;
  example: string;
  category: string;
  audioUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserProgress {
  userId: string;
  learnedIdioms: string[];
  points: number;
  level: number;
}
