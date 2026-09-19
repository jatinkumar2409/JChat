import AuthScreen from "@/features/auth/screens/AuthScreen";
import { router } from "expo-router";
export default function AuthRoute(){
  return AuthScreen(() => {
    router.replace("/(bottomNav)")
  })
}