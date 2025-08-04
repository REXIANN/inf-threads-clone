import Post, { type Post as PostType } from "@/components/Post";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { usePathname } from "expo-router";
import { useCallback, useContext, useRef, useState } from "react";
import { PanResponder, StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimationContext } from "./_layout";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<PostType>);

export default function Index() {
  const colorScheme = useColorScheme();
  const path = usePathname();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const scrollPosition = useSharedValue(0);
  const isReadyToRefresh = useSharedValue(false);

  const { pullDownPosition } = useContext(AnimationContext);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollPosition.value = event.contentOffset.y;
    },
  });

  const onEndReached = useCallback(() => {
    console.log("onEndReached", posts.at(-1)?.id);
    fetch(`/posts?cursor=${posts.at(-1)?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts.length > 0) {
          setPosts((prev) => [...prev, ...data.posts]);
        }
      });
  }, [posts, path]);

  const onRefresh = (done: () => void) => {
    setPosts([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetch("/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .finally(() => {
        done();
      });
  };

  const onPanRelease = () => {
    pullDownPosition.value = withTiming(isReadyToRefresh.value ? 60 : 0, {
      duration: 180,
    });

    if (isReadyToRefresh.value) {
      onRefresh(() => {
        pullDownPosition.value = withTiming(0, {
          duration: 180,
        });
      });
    }
  };

  const panResponderRef = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const max = 120;

        pullDownPosition.value = Math.max(Math.min(gestureState.dy, max), 0);
        if (pullDownPosition.value >= max / 2 && !isReadyToRefresh.value) {
          isReadyToRefresh.value = true;
        }

        if (pullDownPosition.value < max / 2 && isReadyToRefresh.value) {
          // 잡아당기다 돌려놓으면 리프레시 안함
          isReadyToRefresh.value = false;
        }
      },
      onPanResponderRelease: onPanRelease,
      onPanResponderTerminate: onPanRelease,
    })
  );

  const pullDownStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pullDownPosition.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
        pullDownStyle,
      ]}
      {...panResponderRef.current.panHandlers}
    >
      <AnimatedFlashList
        refreshControl={<View />}
        refreshing={refreshing}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        estimatedItemSize={350}
        data={posts}
        renderItem={({ item }) => <Post item={item} />}
        onEndReachedThreshold={2}
        onEndReached={onEndReached}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  textLight: {
    color: "black",
  },
  textDark: {
    color: "white",
  },
});
