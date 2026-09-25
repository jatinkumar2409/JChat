import { Text } from "expo-router/build/react-navigation"
import { useColorScheme, StyleSheet } from "react-native";
import { AppBar } from "@/core/components/MainAppBar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getColors } from "@/core/theme/Theme";
function ChatScreen() {
  const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const colors = getColors(isDark);
  return (
    <SafeAreaProvider style={[
        styles.flex,
        {
          backgroundColor: colors.background,
        },
      ]}>
      <AppBar isDark={isDark}/>
      <Text>
        Chat Screen
      </Text>
    </SafeAreaProvider>
  )
}

export default ChatScreen


const styles = StyleSheet.create({
  flex: {
    flex: 1,
    },
})