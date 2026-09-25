import React, { use, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
} from "react-native";
import {
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { AppBar } from "@/core/components/MainAppBar";
import { Ionicons } from "@expo/vector-icons";
import { getColors, PrimaryTheme } from "@/core/theme/Theme";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "@/core/firebase/firebaseConfig";
import { container } from "@/features/auth/container";
import { UserDTO } from "@/core/models/User";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
const RECENTS: UserDTO[] = [
  { userId: "u1", name: "Aarav Mehta", userName: "aarav.m"  , email : "" , profilePicture : "" ,about : ""},
  { userId: "u2", name: "Priya Nair", userName: "priyanair" , email : "" , profilePicture : "" ,about : "" },
  { userId: "u3", name: "Rohan Gupta", userName: "rohan_g" , email : "" , profilePicture : "" ,about : "" },
];

function SearchScreenContent() {
  const userService = container.searchService;
  const isDark = useColorScheme() === "dark";
  const colors = getColors(isDark);

  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState(RECENTS);
  const [suggested, setSuggested] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [user , setuser] = useState<User| null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<TextInput>(null);
  const [idToken, setIdToken] = useState<string | null>(null);


  function handleUserClick(user : UserDTO){
    router.push({
      pathname : "/directMessage" ,
      params : {
        user : JSON.stringify(user)
      }
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth , (currentUser)=> {
       setuser(currentUser);
    })
  
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function getIdToken(){
      if(user == null) return;
      let idToken = await user.getIdToken();
      setIdToken(idToken);
    }
    getIdToken();
  
  }, [user])
  
  

  useEffect(() => {
    if (query.trim().length < 3 || user == null || idToken == null) {
      abortRef.current?.abort();
      setSuggested([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      abortRef.current?.abort();
      abortRef.current = controller;

      setLoading(true);

      userService.searchUsers(query , signal , idToken , (users)=>{
        console.log("users are:");
        console.log(users);
        setLoading(false);
        setSuggested(users);
      } , (error) => {
        console.log(error);
        setLoading(false);
        Toast.show({
          type: 'error' , text1 : error
        })
      })
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleBack = () => {
    inputRef.current?.blur();
    setQuery("");
    setIsFocused(false);
  };

  return (
    <View
      style={[
        styles.flex,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppBar isDark={isDark} />

      <View style={styles.searchWrapper}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.inputBackground,
              borderColor: isFocused
                ? PrimaryTheme.primary40
                : colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={isFocused ? handleBack : undefined}
            disabled={!isFocused}
            style={styles.leadingIcon}
          >
            {isFocused ? (
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.secondaryText}
              />
            ) : (
              <Ionicons
                name="search"
                size={20}
                color={colors.secondaryText}
              />
            )}
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search JChat"
            placeholderTextColor={colors.secondaryText}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          color={colors.text}
        />
      ) : (
        <FlatList
          data={isFocused ? suggested : recents}
          keyExtractor={(item) => item.userId}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={()=> {handleUserClick(item)}}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: PrimaryTheme.primary40,
                  },
                ]}
              >
                <Text style={styles.avatarText}>
                  {item.name.charAt(0)}
                </Text>
              </View>

              <View>
                <Text
                  style={[
                    styles.name,
                    { color: colors.text },
                  ]}
                >
                  {item.name}
                </Text>

                {item.userName ? (
                  <Text
                    style={[
                      styles.username,
                      { color: colors.secondaryText },
                    ]}
                  >
                    @{item.userName}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                { color: colors.secondaryText },
              ]}
            >
              {!isFocused
                ? "No recent searches"
                : "No results found"}
            </Text>
          }
        />
      )}
    </View>
  );
}

export default function SearchScreen() {
  return (
    <SafeAreaProvider>
      <SearchScreenContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  leadingIcon: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    padding : 0
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  name: {
    fontSize: 16,
    fontWeight: "500",
  },

  username: {
    fontSize: 13,
    marginTop: 2,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
  },
});
