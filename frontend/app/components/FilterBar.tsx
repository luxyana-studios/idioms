import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Animated,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { FilterKey } from '../hooks/useCards';

type FilterIcon = 'list' | 'star' | 'shuffle' | 'search';

const FILTERS: { key: FilterKey; label: string; icon: FilterIcon }[] = [
  { key: 'all', label: 'All', icon: 'list' },
  { key: 'favorites', label: 'Favorites', icon: 'star' },
  { key: 'random', label: 'Shuffle', icon: 'shuffle' },
  { key: 'search', label: 'Search', icon: 'search' },
];

interface FilterBarProps {
  activeFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  searchInput: string;
  onSearchInputChange: (input: string) => void;
  searchSort: 'frequency' | 'imagery' | undefined;
  onSearchSortChange: (sort: 'frequency' | 'imagery' | undefined) => void;
  onSearchFocus: () => void;
  onSearchClear: () => void;
  searchBarScale: Animated.AnimatedInterpolation<number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
  searchInput,
  onSearchInputChange,
  searchSort,
  onSearchSortChange,
  onSearchFocus,
  onSearchClear,
  searchBarScale,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <View className="px-6 pt-6 pb-3">
        <View
          className="flex-row items-center justify-between"
          style={{ gap: 10 }}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => onFilterChange(f.key)}
              style={{
                backgroundColor:
                  activeFilter === f.key
                    ? colors.text
                    : colors.searchBackground,
                borderColor: colors.border,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 70,
                minHeight: 44,
                paddingHorizontal: 16,
                marginHorizontal: 0,
              }}
              className="p-3 rounded-2xl border shadow-lg"
            >
              <Ionicons
                name={f.icon}
                size={20}
                color={activeFilter === f.key ? colors.background : colors.text}
                style={{ marginRight: activeFilter === f.key ? 8 : 0 }}
              />
              {activeFilter === f.key && (
                <Text
                  style={{
                    color: colors.background,
                    fontWeight: 'bold',
                  }}
                >
                  {f.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeFilter === 'search' && (
        <>
          <View className="px-6 pb-2">
            <Animated.View
              style={{
                transform: [{ scale: searchBarScale }],
                backgroundColor: colors.searchBackground,
                borderColor: colors.border,
              }}
              className="flex-row items-center rounded-2xl overflow-hidden border shadow-lg"
            >
              <View className="pl-4">
                <Ionicons
                  name="search"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <TextInput
                className="flex-1 py-4 px-3 text-lg font-medium"
                style={{ color: colors.text }}
                placeholder="Search idioms"
                value={searchInput}
                onChangeText={onSearchInputChange}
                onFocus={onSearchFocus}
                placeholderTextColor={colors.textSecondary}
              />
              {searchInput !== '' && (
                <TouchableOpacity onPress={onSearchClear} className="pr-5">
                  <Ionicons
                    name="close"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
          <View className="px-6 pb-2 flex-row space-x-3">
            <TouchableOpacity
              onPress={() =>
                onSearchSortChange(
                  searchSort === 'frequency' ? undefined : 'frequency',
                )
              }
              style={{
                backgroundColor:
                  searchSort === 'frequency'
                    ? colors.text
                    : colors.searchBackground,
                borderColor: colors.border,
                flex: 1,
              }}
              className="flex-row items-center justify-center p-3 rounded-2xl border shadow-lg"
            >
              <Ionicons
                name="trending-up"
                size={18}
                color={
                  searchSort === 'frequency' ? colors.background : colors.text
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color:
                    searchSort === 'frequency'
                      ? colors.background
                      : colors.text,
                  fontWeight: searchSort === 'frequency' ? 'bold' : 'normal',
                }}
              >
                Frequency
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onSearchSortChange(
                  searchSort === 'imagery' ? undefined : 'imagery',
                )
              }
              style={{
                backgroundColor:
                  searchSort === 'imagery'
                    ? colors.text
                    : colors.searchBackground,
                borderColor: colors.border,
                flex: 1,
              }}
              className="flex-row items-center justify-center p-3 rounded-2xl border shadow-lg"
            >
              <Ionicons
                name="image-outline"
                size={18}
                color={
                  searchSort === 'imagery' ? colors.background : colors.text
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color:
                    searchSort === 'imagery' ? colors.background : colors.text,
                  fontWeight: searchSort === 'imagery' ? 'bold' : 'normal',
                }}
              >
                Imagery
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};
