import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ActivityTabs() {
  const { tabs } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{tabs}</Text>
    </View>
  );
}
