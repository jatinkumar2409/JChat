import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { container } from "../container";

const PrimaryTheme = {
  primary20: "#8FCAFA",
  primary40: "#2798F5",
  primary60: "#0B8BF4",
};

export default function AuthScreen(navigateToHome : () => void) {
  const authService = container.authService;  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading , setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName , setUserName] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    background: isDark ? "#0D1117" : "#F8FAFC",
    surface: isDark ? "#161B22" : "#FFFFFF",
    text: isDark ? "#F0F6FC" : "#111827",
    secondaryText: isDark ? "#8B949E" : "#6B7280",
    border: isDark ? "#30363D" : "#D1D5DB",
    inputBackground: isDark ? "#0D1117" : "#F9FAFB",
  };

  const handleSubmit = async () => {
  
    if (!isLogin) {
        if(email.trim().length == 0 || password.trim().length == 0 || name.trim().length == 0 || userName.trim().length == 0){
            return
        }
        setIsLoading(true);
        await authService.createAccount(name , userName , email , password , () => {
          Toast.show({
            type : "success",
            text1 : "Welcome " + name + "!"
          })
          setIsLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          navigateToHome();
        }, (message) =>{
             Toast.show({
              type : "error" ,
              text1 : message
             })
             setIsLoading(false);
             setEmail("");
             setPassword("");
        })
      
      
    } else {
      
      if(email.trim().length == 0 || password.trim().length == 0){
            return
        }
        setIsLoading(true);
        await authService.logIn(email , password , function (){
          Toast.show({
            type : "success",
            text1 : "Welcome " + name + "!"
          })
          setIsLoading(false);
          setEmail("");
          setPassword("");
          navigateToHome();
        } , function(e){
          Toast.show({
              type : "error" ,
              text1 : e
             })
             setIsLoading(false);
             setEmail("");
             setPassword("");
        });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>

          {/* Logo / App Name */}
          <View style={styles.header}>
            <View
              style={[
                styles.logo,
                { backgroundColor: PrimaryTheme.primary60 },
              ]}
            >
              <Text style={styles.logoText}>J</Text>
            </View>

            <Text
              style={[
                styles.appName,
                { color: colors.text },
              ]}
            >
              JChat
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.secondaryText },
              ]}
            >
              {isLogin
                ? "Welcome back! Sign in to continue."
                : "Create your account and start chatting."}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.text },
                  ]}
                >
                  Name
                </Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.secondaryText}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                    },
                  ]}
                  autoCapitalize="words"
                />
              </View>
            )}

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.text },
                  ]}
                >
                  Name
                </Text>

                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Enter your unique Username"
                  placeholderTextColor={colors.secondaryText}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                    },
                  ]}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  { color: colors.text },
                ]}
              >
                Email
              </Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.secondaryText}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                  },
                ]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  { color: colors.text },
                ]}
              >
                Password
              </Text>

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.secondaryText}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                  },
                ]}
                secureTextEntry
              />
            </View>

            {/* Submit */}
            <Pressable
              disabled={isLoading}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: PrimaryTheme.primary60,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              {!isLoading ? 
                 <Text
                style={[
                  styles.submitText
                ]}
              >
                {!isLogin ? " Sign Up" : " Sign In"}
              </Text> : 
              <ActivityIndicator size={"small"} color={PrimaryTheme.primary20}/>
              
              }
            </Pressable>
          </View>

          {/* Switch Login / Signup */}
          <View style={styles.switchContainer}>
            <Text
              style={[
                styles.switchText,
                { color: colors.secondaryText },
              ]}
            >
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </Text>

            <Pressable
              disabled = {isLoading}
              onPress={() => setIsLogin((previous) => !previous)}
            >
                 <Text
                style={[
                  styles.switchButton,
                  { color: PrimaryTheme.primary40 },
                ]}
              >
                {isLogin ? " Sign Up" : " Sign In"}
              </Text>
              
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  content: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
  },

  appName: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  form: {
    gap: 18,
  },

  inputContainer: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  submitButton: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },

  switchText: {
    fontSize: 14,
  },

  switchButton: {
    fontSize: 14,
    fontWeight: "700",
  },
});