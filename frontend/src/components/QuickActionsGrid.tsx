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
  const rows = [quickActions.slice(0, 2), quickActions.slice(2, 4)];
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
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} className="flex-row justify-between mb-4 px-2">
            {row.map((action, colIdx) => (
              <View
                key={colIdx}
                className={colIdx === 0 ? 'flex-1 mr-2' : 'flex-1 ml-2'}
              >
                <QuickAction
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  onPress={() => navigateTo(action.route)}
                  compact={true}
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      <View className="flex-1" />
    </>
  );
};

export default QuickActionsGrid;
