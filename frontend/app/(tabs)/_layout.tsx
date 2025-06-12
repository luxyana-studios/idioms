import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWelcome } from '../contexts/WelcomeContext';

type TabIconProps = {
  focused: boolean;
  title: string;
  iconName: 'home' | 'search' | 'star' | 'person';
};

const TabIcon = ({ focused, title, iconName }: TabIconProps) => {
  if (focused) {
    return (
      <View className="flex flex-row w-full min-w-28 min-h-16 mt-4 justify-center items-center rounded-lg bg-gradient-to-r from-blue-400 to-purple-600">
        <Ionicons name={iconName} size={20} color="#FFFFFF" />
        <Text className="text-white text-base font-semibold ml-2">{title}</Text>
      </View>
    );
  }
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Ionicons name={iconName} size={20} color="#A8B5DB" />
    </View>
  );
};

const TabLayout = () => {
  const { showWelcome } = useWelcome();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#0f0D23',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          display: showWelcome ? 'none' : 'flex', // Ocultar tabs durante la bienvenida
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="search" title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="star" title="Favorites" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person" title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
