import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { onAuthStateChanged , User } from "firebase/auth";
import { auth } from "@/core/firebase/firebaseConfig";
import { useState , useEffect } from "react";
import { router } from "expo-router";
import { useSegments } from "expo-router";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [user, setuser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth , (currentUser)=> {
      setuser(currentUser);
      setIsLoading(false);
    })
  
    return unsubscribe;
  }, [])

  useEffect(() => {
    if (isLoading) return;
     console.log("SEGMENTS:", segments);

    if(user){
      router.replace("/(bottomNav)/chat")
    }
    else{
      router.replace("/auth");
    }
  }, [isLoading , user])
  
  

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack screenOptions={{ headerShown: false }}/>
        
      <Toast />
    </ThemeProvider>
  );
}