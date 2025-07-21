import React from 'react';
import { View, Text } from 'react-native';
import QuickAction from './QuickAction';

interface QuickActionItem {
  title: string;
  description: string;
  icon: any;
  route: string;
}

interface QuickActionsGridProps {
  colors: any;
  quickActions: QuickActionItem[];
  navigateTo: (route: string) => void;
}

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  colors,
  quickActions,
  navigateTo,
}) => {
  return (
    <>
      <View style={{ zIndex: 1 }}>
        <Text
          style={{ color: colors.text }}
          className="text-xl font-semibold mb-4 text-center"
        >
          Quick Actions
        </Text>
      </View>

      <View style={{ zIndex: 1, marginTop: 180 }}>
        <View className="flex-row justify-between mb-4 px-2">
          <View className="flex-1 mr-2">
            <QuickAction
              title={quickActions[0].title}
              description={quickActions[0].description}
              icon={quickActions[0].icon}
              onPress={() => navigateTo(quickActions[0].route)}
              compact={true}
            />
          </View>
          <View className="flex-1 ml-2">
            <QuickAction
              title={quickActions[1].title}
              description={quickActions[1].description}
              icon={quickActions[1].icon}
              onPress={() => navigateTo(quickActions[1].route)}
              compact={true}
            />
          </View>
        </View>
      </View>

      <View className="flex-1" />

      <View style={{ zIndex: 1, marginBottom: 100 }}>
        <View className="flex-row justify-between mb-4 px-2">
          <View className="flex-1 mr-2">
            <QuickAction
              title={quickActions[2].title}
              description={quickActions[2].description}
              icon={quickActions[2].icon}
              onPress={() => navigateTo(quickActions[2].route)}
              compact={true}
            />
          </View>
          <View className="flex-1 ml-2">
            <QuickAction
              title={quickActions[3].title}
              description={quickActions[3].description}
              icon={quickActions[3].icon}
              onPress={() => navigateTo(quickActions[3].route)}
              compact={true}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default QuickActionsGrid;
