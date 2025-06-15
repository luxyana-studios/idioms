import { useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface UseInfiniteScrollProps {
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  scrollPadding?: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  scrollPadding = 20,
}: UseInfiniteScrollProps) => {
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      if (
        layoutMeasurement.height + contentOffset.y >=
          contentSize.height - scrollPadding &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, scrollPadding],
  );

  return { handleScroll };
};
