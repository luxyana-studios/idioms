import 'dotenv/config';

/* global process */

export default () => ({
  expo: {
    name: 'idioms',
    slug: 'idioms-app',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'idioms',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff',
      },
      package: 'com.davidserrano.idioms',
    },
    web: {
      bundler: 'metro',
      output: 'static',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/splashscreen_logo.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-font',
      'expo-video',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: process.env.API_URL,
      router: {
        origin: false,
      },
      eas: {
        projectId: '925eb8a9-3809-4b5c-8ea2-48968e6136a6',
      },
    },
  },
});
