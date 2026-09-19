import { MessageMetadata } from "./Message";

export type WebsocketMessageType =
  | "ACK_MESSAGE_SENT"
  | "ACK_MESSAGE_DELIVERED"
  | "ACK_MESSAGE_RECEIVED"
  | "MESSAGE_CREATED"
  | "MESSAGE_EDITED"
  | "MESSAGE_DELETED";

export type WebsocketMessageDTO =
  | AckMessageDeliveredOrReceived
  | MessageEvent;

export interface AckMessageDeliveredOrReceived {
  messageType: WebsocketMessageType;
  conversationId: string;
  receiverId: string;
  messageId: string;
  receivedAt: number;
}

export interface MessageEvent {
  messageType: WebsocketMessageType;
  messageBody: MessageMetadata;
}