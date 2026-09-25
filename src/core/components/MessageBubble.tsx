import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { MessageMetadata, MessageReceiver } from "../models/Message";
import { getColors, PrimaryTheme } from "../theme/Theme";

type MessageStatus = "sent" | "delivered" | "read";

interface MessageBubbleProps {
  message: MessageMetadata;
  receiver?: MessageReceiver;
  currentUserId: string;
  isDark: boolean;
}

export function MessageBubble({
  message,
  receiver,
  currentUserId,
  isDark,
}: MessageBubbleProps) {
  const colors = getColors(isDark);

  const isMine = message.senderId === currentUserId;

  const status: MessageStatus =
    !isMine
      ? "sent"
      : receiver?.receivedAt
        ? "read"
        : receiver?.deliveredAt
          ? "delivered"
          : "sent";

  const tickColor =
    status === "read"
      ? PrimaryTheme.primary60
      : colors.secondaryText;

  const messageText =
    message.message.type === "TextMessage"
      ? message.message.text
      : "";

  const formattedTime = new Date(message.sentAt ?? Date.now()).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View
      style={[
        styles.messageRow,
        isMine
          ? styles.myMessageRow
          : styles.otherMessageRow,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: isMine
              ? PrimaryTheme.primary20
              : colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: colors.text,
            },
          ]}
        >
          {messageText}
        </Text>

        <View style={styles.messageMeta}>
          <Text
            style={[
              styles.messageTime,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            {formattedTime}
          </Text>

          {isMine && (
            <Ionicons
              name={
                status === "sent"
                  ? "checkmark"
                  : "checkmark-done"
              }
              size={16}
              color={tickColor}
            />
          )}
        </View>
      </View>
    </View>
  );
}

// function getMessageStatus(messageMetadata : MessageMetadata , currentUserId : string) : MessageStatus| null{
//  if(messageMetadata.senderId !== currentUserId) return null;
//  if(messageMetadata.)
//  return ""
// }
const styles = StyleSheet.create({
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
});