import { ConversationType } from "./Conversation";

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
  sentAt?: number | null;
  deletedAt?: number | null;
  version: number;
}

export interface FirstMessageMetadata{
  messageId: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  message: Message;
  sentAt?: number | null;
  deletedAt?: number | null;
  version: number;
  receiverId : string
}

export interface MessageReceiver {
  messageId: string;
  conversationId: string;
  receiverId: string;
  deliveredAt?: number | null;
  receivedAt?: number | null;
}