import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { colors } = useTheme();

  const drawerItems = [
    {
      label: 'Home',
      icon: 'home' as const,
      screen: 'home',
    },
    {
      label: 'Search',
      icon: 'search' as const,
      screen: 'search',
    },
    {
      label: 'All Cards',
      icon: 'list' as const,
      screen: 'all',
    },
    {
      label: 'Favorites',
      icon: 'star' as const,
      screen: 'favorites',
    },
    {
      label: 'Shuffle',
      icon: 'shuffle' as const,
      screen: 'shuffle',
    },
  ];

  const profileItem = {
    label: 'Profile',
    icon: 'person' as const,
    screen: 'profile',
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: 50 }}
    >
      <View
        className="px-4 pb-6"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Text style={{ color: colors.text }} className="text-2xl font-bold">
          Idioms
        </Text>
        <Text style={{ color: colors.textSecondary }} className="text-sm mt-1">
          Explore and learn idioms
        </Text>
      </View>

      <View className="mt-6">
        {drawerItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              props.navigation.navigate(item.screen);
            }}
            className="flex-row items-center px-6 py-4 mx-2 rounded-lg mb-2"
            style={{
              backgroundColor:
                props.state.routeNames[props.state.index] === item.screen
                  ? colors.primary + '20'
                  : 'transparent',
            }}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={
                props.state.routeNames[props.state.index] === item.screen
                  ? colors.primary
                  : colors.textSecondary
              }
            />
            <Text
              style={{
                color:
                  props.state.routeNames[props.state.index] === item.screen
                    ? colors.primary
                    : colors.text,
              }}
              className="ml-4 text-lg font-medium"
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Profile section at the bottom */}
      <View
        className="mt-auto mb-6 pt-6"
        style={{ borderTopWidth: 1, borderTopColor: colors.border }}
      >
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate(profileItem.screen);
          }}
          className="flex-row items-center px-6 py-4 mx-2 rounded-lg"
          style={{
            backgroundColor:
              props.state.routeNames[props.state.index] === profileItem.screen
                ? colors.primary + '20'
                : 'transparent',
          }}
        >
          <Ionicons
            name={profileItem.icon}
            size={24}
            color={
              props.state.routeNames[props.state.index] === profileItem.screen
                ? colors.primary
                : colors.textSecondary
            }
          />
          <Text
            style={{
              color:
                props.state.routeNames[props.state.index] === profileItem.screen
                  ? colors.primary
                  : colors.text,
            }}
            className="ml-4 text-lg font-medium"
          >
            {profileItem.label}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Home',
          title: 'Idioms',
        }}
      />
      <Drawer.Screen
        name="search"
        options={{
          drawerLabel: 'Search',
          title: 'Search Idioms',
        }}
      />
      <Drawer.Screen
        name="all"
        options={{
          drawerLabel: 'All Cards',
          title: 'All Cards',
        }}
      />
      <Drawer.Screen
        name="favorites"
        options={{
          drawerLabel: 'Favorites',
          title: 'Favorites',
        }}
      />
      <Drawer.Screen
        name="shuffle"
        options={{
          drawerLabel: 'Shuffle',
          title: 'Shuffle',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
        }}
      />
    </Drawer>
  );
}
