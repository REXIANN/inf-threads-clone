import { AuthContext } from "@/app/_layout";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useContext(AuthContext);

  const insets = useSafeAreaInsets();

  const isLoggedIn = !!user;

  console.log({ pathname });

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <BlurView style={styles.header} intensity={70}>
        <Image
          style={styles.headerLogo}
          source={require("@/assets/images/react-logo.png")}
        />
        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        )}
      </BlurView>
      <View style={styles.tabContainer}>
        {isLoggedIn && (
          <>
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
          </>
        )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
  },
  header: {
    alignItems: "center",
  },
  headerLogo: {
    width: 42,
    height: 42,
  },
  loginButton: {
    position: "absolute",
    top: 0,
    right: 20,
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "white",
  },
});
