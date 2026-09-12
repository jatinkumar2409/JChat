import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from '@/navigation/MainNavStack';
import Toast from "react-native-toast-message";
export default function JChat(){
    const colorScheme = useColorScheme();
      return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NavigationContainer>
             <MainNavigator/>
          </NavigationContainer>
          <Toast/>
        </ThemeProvider>
      );
}