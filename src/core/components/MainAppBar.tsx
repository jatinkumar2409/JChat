import { View, Text, StyleSheet ,  Image, Pressable, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getColors, PrimaryTheme } from "../theme/Theme";
import { UserDTO } from "../models/User";

interface AppBarProps{
  isDark : boolean
}
interface ChatAppBarProps{
  isDark : boolean , 
  user : UserDTO
}
export function AppBar({isDark} : AppBarProps ) {
  const colors = getColors(isDark);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.appBar,
        {
          backgroundColor: PrimaryTheme.primary40,
          borderBottomColor: colors.border,
          paddingTop: insets.top,
        },
      ]}
    >
      <Text style={styles.appBarTitle}>JChat</Text>
    </View>
  );
}

export function ChatAppBar({ isDark, user }: ChatAppBarProps) {
  const colors = getColors(isDark);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.chatAppBar,
        {
          backgroundColor: PrimaryTheme.primary40,
          borderBottomColor: colors.border,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* Back button */}
      <Pressable
        style={styles.iconButton}
        onPress={() => {
          // navigation.goBack()
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={colors.text}
        />
      </Pressable>

      {/* Profile picture */}
      {user.profilePicture ? (
        <Image
          source={{ uri: user.profilePicture }}
          style={styles.avatar}
        />
      ) : (
        <View
          style={[
            styles.avatarPlaceholder,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Ionicons
            name="person"
            size={22}
            color={colors.secondaryText}
          />
        </View>
      )}

      {/* User name */}
      <View style={styles.userInfo}>
        <Text
          style={[
            styles.userName,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {user.name}
        </Text>
      </View>

      {/* Call button */}
      <Pressable
        style={styles.iconButton}
        onPress={() => {
          // start call
        }}
      >
        <Ionicons
          name="call-outline"
          size={23}
          color={colors.text}
        />
      </Pressable>

      {/* More button */}
      <Pressable
        style={styles.iconButton}
        onPress={() => {
          // open menu
        }}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={colors.text}
        />
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  appBar: {
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  appBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
   chatAppBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 2,
  },

  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  userInfo: {
    flex: 1,
    marginLeft: 10,
  },

  userName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});