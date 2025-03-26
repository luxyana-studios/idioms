# Estructura del Proyecto Idioms

# Estructura del Proyecto `Idioms`

```bash
src/
├── assets/          # Recursos estáticos
│   ├── images/      # Logos, fondos
│   └── sounds/      # Audios de pronunciación
├── components/      # UI Reutilizable
│   ├── FlashCard.tsx    # Tarjeta interactiva
│   └── SwipeableCard.tsx # Versión con gestos
├── contexts/        # Estado Global
│   ├── AuthContext.tsx  # Autenticación
│   └── LanguageContext.tsx # Idioma
├── hooks/           # Lógica Reusable
│   ├── useCardGestures.ts # Detección de gestos
│   └── useFirebaseData.ts # Conexión a Firebase
├── navigation/      # Rutas
│   ├── AppNavigator.tsx  # Navegación principal
│   └── MainTabNavigator.tsx # Menú inferior
├── screens/         # Pantallas
│   ├── HomeScreen.tsx    # Listado de tarjetas
│   └── FavoritesScreen.tsx # Favoritos
├── services/        # Conexiones Externas
│   ├── firebase.ts  # Configuración de Firebase
│   └── audioPlayer.ts # Reproducción de audio
├── types/           # Tipos TypeScript
│   ├── cardTypes.ts # Tipo "Card"
│   └── navigationTypes.ts # Rutas
└── utils/           # Utilidades
    ├── translations.ts # Textos multiidioma
    └── helpers.ts   # Funciones auxiliares
```
