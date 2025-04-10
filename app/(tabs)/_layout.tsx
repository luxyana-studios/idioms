import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TabIconProps = {
  focused: boolean;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

const TabIcon = ({ focused, title, iconName }: TabIconProps) => {
  if (focused) {
    return (
      <View className="flex flex-row w-full flex-1 min-w-28 min-h-16 mt-4 justify-center items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
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
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 0.5,
          borderColor: '0f0D23',
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
