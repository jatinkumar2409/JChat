import { ChatAppBar } from "@/core/components/MainAppBar";
import { MessageBubble } from "@/core/components/MessageBubble";
import { auth } from "@/core/firebase/firebaseConfig";
import { MessageMetadata } from "@/core/models/Message";
import { UserDTO } from "@/core/models/User";
import { getColors, PrimaryTheme } from "@/core/theme/Theme";
import { webSocketManager, WebSocketState } from "@/core/websockets/WebSocketManager";
import { container } from "@/features/auth/container";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { BACKEND_URL } from "../../../../config";
interface DirectMessageProps {
  user: UserDTO
}

export default function DirectMessageScreen({
  user,
}: DirectMessageProps) {
  const directMessageService = container.directMessageService;
  const [wsState, setWsState] = useState(webSocketManager.state);
  const isDark = useColorScheme() === "dark";
  const colors = getColors(isDark);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [messages] = useState<MessageMetadata[]>([

  ]);

  function handleSend() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    directMessageService.sendTextMessage({ type: "TextMessage", text: trimmedMessage }, user.userId, currentUser!!.uid)

    setMessage("");
  }

  useEffect(() => {
    if (wsState !== WebSocketState.CONNECTED && wsState !== WebSocketState.CONNECTING) {
      webSocketManager.connect(`${BACKEND_URL}/chat`);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (cu) => {
      setCurrentUser(cu);
      setLoading(false);
    })

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = webSocketManager.subscribe((message) => {
      directMessageService.receiveMessage(message, user.userId);
    });

    const stateUnsubscribe = webSocketManager.subscribeState((state) => {
      setWsState(state);
    });

    return () => {
      unsubscribe();
      stateUnsubscribe();
    }
  }, [])

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={PrimaryTheme.primary40} />
        <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
          Loading conversation...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Chat App Bar */}
      <ChatAppBar
        isDark={isDark}
        user={user}
      />

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.messageId}
        renderItem={({ item }) => (
          <MessageBubble
            currentUserId=""
            message={item}
            isDark={isDark}
          />
        )}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      />

      {/* Message Composer */}
      <View
        style={[
          styles.composerContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Pressable
            style={styles.attachmentButton}
            onPress={() => {
              // Open attachment picker
            }}
          >
            <Ionicons
              name="add"
              size={24}
              color={colors.secondaryText}
            />
          </Pressable>

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            placeholderTextColor={colors.secondaryText}
            multiline
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />

          <Pressable
            style={styles.emojiButton}
            onPress={() => {
              // Open emoji picker
            }}
          >
            <Ionicons
              name="happy-outline"
              size={23}
              color={colors.secondaryText}
            />
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.sendButton,
            {
              backgroundColor: PrimaryTheme.primary40,
            },
          ]}
          onPress={handleSend}
        >
          <Ionicons
            name="send"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 16,
  },

  messagesContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },

  messageRow: {
    width: "100%",
    flexDirection: "row",
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "80%",
    minWidth: 80,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 21,
  },

  messageMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    gap: 3,
    marginTop: 3,
  },

  messageTime: {
    fontSize: 11,
  },

  composerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: 4,
    paddingRight: 8,
  },

  attachmentButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
  },

  emojiButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 46,
    height: 46,
    borderRadius: 23,
  },
});
