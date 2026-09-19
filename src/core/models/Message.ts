export type MessageType =
  | "TEXT";

export type Message =
  | {
      type: "TextMessage";
      text: string;
    };

export interface MessageMetadata {
  messageId: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  message: Message;
  sentAt: number;
  deletedAt?: number | null;
  version: number;
}

export interface MessageReceiver {
  messageId: string;
  conversationId: string;
  receiverId: string;
  deliveredAt?: number | null;
  receivedAt?: number | null;
}