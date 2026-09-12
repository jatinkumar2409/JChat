import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from "../features/auth/screens/AuthScreen";
import MainScreen from '@/features/chat/screens/MainScreen';
const MainNavStack = createNativeStackNavigator();

export default function MainNavigator(){
    return(
        <MainNavStack.Navigator initialRouteName='Auth'
         screenOptions={{
        headerShown: false,
    }}>
            <MainNavStack.Screen
             name='Auth'
             component={AuthScreen}
             >
            </MainNavStack.Screen>
            <MainNavStack.Screen 
             name='BottomNav'
             component={MainScreen}>

            </MainNavStack.Screen>
        </MainNavStack.Navigator>
    )
}