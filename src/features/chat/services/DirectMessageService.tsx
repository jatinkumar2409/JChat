import { createConversationId, toConversationModel } from "@/core/helpers/ConversationHelpers";
import { Conversation } from "@/core/models/Conversation";
import { FirstMessageMetadata, Message, MessageMetadata } from "@/core/models/Message";
import { MessageStatus } from "@/core/models/MessageStatus";
import { WebsocketMessageDTO, WebsocketMessageType } from "@/core/models/Websocket";
import { ChatDao } from "@/core/sqlite/dao/ChatDao";
import { webSocketManager } from "@/core/websockets/WebSocketManager";
import * as Crypto from "expo-crypto";
type MessageHandler = (message: WebsocketMessageDTO) => void;
export class DirectMessageService {
  constructor(private dao: ChatDao) {

  }


  async getCurrentMessageStatus(messageMetadata : MessageMetadata , receiverId : string): Promise<MessageStatus>{
    let messageReciever = await this.dao.getMessageReceiver(messageMetadata.messageId , receiverId);
    if(!messageMetadata.sentAt){
      return "INITIAL";
    }
    else if(!messageReciever.deliveredAt){
      return "SENT";
    }
    else if(!messageReciever.receivedAt){
      return "DELIVERED_TO_ALL";
    }
    else{
      return "READ_BY_ALL";
    }
  }
  async receiveMessage(message: WebsocketMessageDTO, userId: string) {
    switch (message.messageType) {
      case "FIRST_MESSAGE_CREATED": {
        if (!("messageBody" in message)) {
          break;
        }

        const messageMetadata = message.messageBody as FirstMessageMetadata;

        await this.createDirectMessageConversationFromId(
          messageMetadata.senderId,
          messageMetadata.receiverId,
          messageMetadata.conversationId
        );
        await this.dao.createMessageMetadata(messageMetadata);
        this.sendMessageDeliveredOrReadAck("ACK_MESSAGE_DELIVERED",
          messageMetadata.conversationId, userId, messageMetadata.messageId, Date.now()
        )
        break;
      }
      case "MESSAGE_CREATED": {
        if (!("messageBody" in message)) {
          break;
        }

        const messageMetadata = message.messageBody;
        await this.dao.createMessageMetadata(messageMetadata);
        this.sendMessageDeliveredOrReadAck("ACK_MESSAGE_DELIVERED",
          messageMetadata.conversationId, userId, messageMetadata.messageId, Date.now()
        )
        break;
      }
      case "ACK_MESSAGE_SENT": {
        break;
      }
      case "ACK_MESSAGE_DELIVERED": {
        if (!("conversationId" in message && "receiverId" in message && "messageId" in message && "receivedAt" in message)) {
          break;
        }

        await this.dao.updateMessageReceiver({
          conversationId: message.conversationId,
          receiverId: message.receiverId,
          messageId: message.messageId,
          deliveredAt: message.receivedAt,
        });
        break;
      }
      case "ACK_MESSAGE_RECEIVED": {
        if (!("conversationId" in message && "receiverId" in message && "messageId" in message && "receivedAt" in message)) {
          break;
        }

        await this.dao.updateMessageReceiver({
          conversationId: message.conversationId,
          receiverId: message.receiverId,
          messageId: message.messageId,
          receivedAt: message.receivedAt,
        });
        break;
      } 
      case "MESSAGE_EDITED": {
        break;
      }
      case "MESSAGE_DELETED": {
        break;
      }
    }
  }
  async createDirectMessageConversation(firstMemberId: string, secondMemberId: string): Promise<string> {
    let conversation = await this.dao.getDirectMessageConversationByMembers(
      firstMemberId, secondMemberId
    );
    if (!conversation) {
      let conversationId = await createConversationId(firstMemberId, secondMemberId);
      let conversationToSave: Conversation = {
        conversationId: conversationId,
        type: "DIRECT",
        membersCount: 2,
        firstMemberId: firstMemberId,
        secondMemberId: secondMemberId,
        name: "",
        profileUrl: "",
        createdAt: Date.now(),
      }
      this.dao.createConversation(
        conversationToSave
      );
      return conversationId
    }
    return conversation.conversationId

  }

  async createDirectMessageConversationFromId(firstMemberId: string, secondMemberId: string, conversationId: string): Promise<Conversation> {
    let conversation = await this.dao.getConversation(conversationId);
    if (!conversation) {
      let conversationToSave: Conversation = {
        conversationId: conversationId,
        type: "DIRECT",
        membersCount: 2,
        firstMemberId: firstMemberId,
        secondMemberId: secondMemberId,
        name: "",
        profileUrl: "",
        createdAt: Date.now(),
      }
      await this.dao.createConversation(conversationToSave);
      return conversationToSave;
    }
    else {
      return toConversationModel(conversation);
    }
  }

  async sendTextMessage(message: Message, senderId: string, receiverId: string) {
    let conversationId = await this.createDirectMessageConversation(senderId, receiverId);

    let messageMetadata: MessageMetadata = {
      messageId: Crypto.randomUUID(),
      conversationId: conversationId,
      senderId: senderId,
      type: "TEXT",
      message: message,
      version: 1
    }
    let messageReceiver = {
      conversationId: conversationId,
      messageId: messageMetadata.messageId,
      receiverId: receiverId,
      deliveredAt: null,
      receivedAt: null
    };
    await this.dao.createMessageMetadata(messageMetadata);
    await this.dao.createMessageReceiver(messageReceiver);


    webSocketManager.send({
      messageType: "MESSAGE_CREATED",
      messageBody: messageMetadata
    }
    )
  }


  async ackMessageSent(messageMetadata: MessageMetadata) {
    let messageMetadataAcknowledged: MessageMetadata = {
      ...messageMetadata, sentAt: Date.now()
    }
    this.dao.updateMessageMetadata(
      messageMetadataAcknowledged
    )
  }

  async sendMessageDeliveredOrReadAck(type: WebsocketMessageType, conversationId: string, receiverId: string, messageId: string, receivedAt: number) {
    webSocketManager.send({
      messageType: type,
      receiverId: receiverId,
      conversationId: conversationId,
      messageId: messageId,
      receivedAt: receivedAt
    })
  }


}