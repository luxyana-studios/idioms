import { useState, useEffect } from 'react';
import { Idiom } from '../types/cardTypes';

// Datos estaticos mockeados
const MOCK_IDIOMS: Idiom[] = [
  {
    id: '1',
    phrase: 'Estar en las nubes',
    meaning: 'Estar distraído o pensando en otra cosa',
    example: 'Juan está en las nubes durante la reunión',
    category: 'expresiones_comunes',
    difficulty: 'beginner',
  },
  {
    id: '2',
    phrase: 'A otra cosa, mariposa',
    meaning: 'Dejar atrás un problema y seguir adelante',
    example: 'Perdiste el trabajo, pero a otra cosa, mariposa',
    category: 'expresiones_animicas',
    difficulty: 'intermediate',
  },
  {
    id: '3',
    phrase: 'Tirar la toalla',
    meaning: 'Rendirse o abandonar algo',
    example: 'Después de intentarlo muchas veces, decidió tirar la toalla',
    category: 'expresiones_comunes',
    difficulty: 'beginner',
  },
  {
    id: '4',
    phrase: 'Ponerse las pilas',
    meaning: 'Animarse, esforzarse más',
    example: 'Si quieres aprobar, tienes que ponerte las pilas',
    category: 'expresiones_motivacionales',
    difficulty: 'intermediate',
  },
];

export const useFirebaseData = (category?: string) => {
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carga de datos
    const timer = setTimeout(() => {
      // Si hay categoría, filtra los idioms
      const filteredIdioms = category
        ? MOCK_IDIOMS.filter((idiom) => idiom.category === category)
        : MOCK_IDIOMS;

      setIdioms(filteredIdioms);
      setLoading(false);
    }, 1000); // Simula un tiempo de carga

    return () => clearTimeout(timer);
  }, [category]);

  return { idioms, loading };
};
