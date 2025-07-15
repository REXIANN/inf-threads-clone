import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  console.log({ pathname });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={{ color: pathname === "/" ? "red" : "black" }}>
            For You{" "}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/following")}>
          <Text style={{ color: pathname === "/" ? "black" : "red" }}>
            Following
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/@zerocho/post/1")}>
          <Text>Post 1</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/@zerocho/post/2")}>
          <Text>Post 2</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/@zerocho/post/3")}>
          <Text>Post 3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
