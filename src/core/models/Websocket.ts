import { FirstMessageMetadata, MessageMetadata } from "./Message";

export type WebsocketMessageType =
  | "ACK_MESSAGE_SENT"
  | "ACK_MESSAGE_DELIVERED"
  | "ACK_MESSAGE_RECEIVED"
  | "FIRST_MESSAGE_CREATED"
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

export interface FirstMessageEvent{
  messageType : WebsocketMessageType;
  messageBody : FirstMessageMetadata
}