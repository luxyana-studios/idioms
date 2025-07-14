import { Drawer } from 'expo-router/drawer';
import { View, Text } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { DrawerItem } from '../../src/components/DrawerItem';

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
      label: 'All Idioms',
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
      style={{ backgroundColor: colors.background, flex: 1 }}
      contentContainerStyle={{ paddingTop: 50, flex: 1 }}
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

      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        {drawerItems.map((item, index) => (
          <DrawerItem
            key={index}
            item={item}
            isActive={props.state.routeNames[props.state.index] === item.screen}
            onPress={() => props.navigation.navigate(item.screen)}
            colors={colors}
          />
        ))}
      </View>

      <View style={{ marginBottom: 12 }}>
        <DrawerItem
          item={profileItem}
          isActive={
            props.state.routeNames[props.state.index] === profileItem.screen
          }
          onPress={() => props.navigation.navigate(profileItem.screen)}
          colors={colors}
        />
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
          drawerLabel: 'All Idioms',
          title: 'All Idioms',
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
