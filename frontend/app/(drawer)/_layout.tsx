import { Drawer } from 'expo-router/drawer';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/contexts/ThemeContext';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { DrawerItem } from '../../src/components/DrawerItem';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { colors, theme } = useTheme();

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

  // Organic Flow gradient colors
  const gradientColors =
    theme === 'light'
      ? [
          'rgba(250, 247, 242, 1)',
          'rgba(167, 196, 160, 0.05)',
          'rgba(240, 235, 227, 1)',
        ]
      : [
          'rgba(30, 36, 32, 1)',
          'rgba(184, 212, 176, 0.04)',
          'rgba(42, 48, 43, 1)',
        ];

  const dividerColor =
    theme === 'light'
      ? 'rgba(167, 196, 160, 0.25)'
      : 'rgba(184, 212, 176, 0.15)';

  return (
    <View style={{ flex: 1 }}>
      {/* Organic gradient background */}
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        locations={[0, 0.5, 1]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <DrawerContentScrollView
        {...props}
        style={{ backgroundColor: 'transparent', flex: 1 }}
        contentContainerStyle={{ paddingTop: 50, flex: 1 }}
      >
        {/* Header with organic styling */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: dividerColor,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: theme === 'light' ? '#A7C4A0' : '#B8D4B0', // Sage green
              fontSize: 26,
              fontWeight: '700',
              letterSpacing: 0.5,
            }}
          >
            Idioms
          </Text>
          <Text
            style={{
              color: theme === 'light' ? '#7A8B6E' : '#C4D4BE', // Earth moss
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Explore and learn idioms
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 4 }}>
          {drawerItems.map((item, index) => (
            <DrawerItem
              key={index}
              item={item}
              isActive={
                props.state.routeNames[props.state.index] === item.screen
              }
              onPress={() => props.navigation.navigate(item.screen)}
              colors={colors}
            />
          ))}
        </View>

        {/* Organic wavy divider before profile */}
        <View
          style={{
            height: 1,
            backgroundColor: dividerColor,
            marginHorizontal: 20,
            marginVertical: 8,
            borderRadius: 1,
          }}
        />

        <View style={{ marginBottom: 16 }}>
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
    </View>
  );
};

export default function DrawerLayout() {
  const { colors, theme } = useTheme();

  // Organic Flow colors
  const headerBg = theme === 'light' ? '#FAF7F2' : '#1E2420';
  const headerTint = theme === 'light' ? '#A7C4A0' : '#B8D4B0';

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'transparent', // Gradient handled in content
          width: 280,
          borderTopRightRadius: 24, // Organic rounded corner
          borderBottomRightRadius: 24,
          overflow: 'hidden',
        },
        headerTransparent: false,
        headerStyle: {
          backgroundColor: headerBg,
          shadowColor: theme === 'light' ? '#8B9B7E' : '#0F1210',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        },
        headerTintColor: headerTint,
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text,
        },
        drawerActiveTintColor: headerTint,
        drawerInactiveTintColor: theme === 'light' ? '#7A8B6E' : '#C4D4BE',
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
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
          headerShown: true,
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
