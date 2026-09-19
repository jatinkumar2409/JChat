import { eq , and } from "drizzle-orm";
import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import type { Conversation } from "../../models/Conversation";
import { conversations } from "../database/schema";
import { messageMetadata } from "../database/schema";
import { MessageMetadata } from "@/core/models/Message";
import { MessageReceiver } from "@/core/models/Message";
import { messageReceiver } from "../database/schema";
export class ChatDao{
    constructor(private db : ExpoSQLiteDatabase){

    }

    async getConversation(conversationId : string){
      return await this.db.select().from(conversations)
      .where(
        eq(conversations.conversationId ,conversationId)
      )
    }

    async createConversation(conversation: Conversation){
      return await this.db
        .insert(conversations)
        .values(conversation)
        .returning();
    }

    async updateConversation(
      conversationId: string,
      changes: Partial<Conversation>
     ) {
  return await this.db
    .update(conversations)
    .set(changes)
    .where(
      eq(conversations.conversationId, conversationId)
    )
    .returning();
}

    async deleteConversation(conversationId: string){
      return await this.db
        .delete(conversations)
        .where(eq(conversations.conversationId, conversationId))
        .returning();
    }

    async createMessageMetadata(message: MessageMetadata) {
  return await this.db
    .insert(messageMetadata)
    .values({
      messageId: message.messageId,
      conversationId: message.conversationId,
      senderId: message.senderId,
      type: message.type,
      message: JSON.stringify(message.message),
      sentAt: message.sentAt,
      deletedAt: message.deletedAt,
      version: message.version,
    })
    .returning();
}

async getMessageMetadata(messageId: string) {
  return await this.db
    .select()
    .from(messageMetadata)
    .where(eq(messageMetadata.messageId, messageId));
}

async updateMessageMetadata(message: MessageMetadata) {
  const { messageId, ...messageChanges } = message;

  return await this.db
    .update(messageMetadata)
    .set({
      ...messageChanges,
      message: JSON.stringify(message.message),
    })
    .where(eq(messageMetadata.messageId, messageId))
    .returning();
}

async deleteMessageMetadata(messageId: string) {
  return await this.db
    .delete(messageMetadata)
    .where(eq(messageMetadata.messageId, messageId))
    .returning();
}

async createMessageReceiver(receiver: MessageReceiver) {
  return await this.db
    .insert(messageReceiver
        
    )
    .values(receiver)
    .returning();
}

async getMessageReceiver(
  messageId: string,
  receiverId: string
) {
  return await this.db
    .select()
    .from(messageReceiver
        
    )
    .where(
      and(
        eq(messageReceiver
            .messageId, messageId),
        eq(messageReceiver
            .receiverId, receiverId)
      )
    );
}

async updateMessageReceiver(receiver: MessageReceiver) {
  const { messageId, receiverId, ...receiverChanges } = receiver;

  return await this.db
    .update(messageReceiver
        
    )
    .set(receiverChanges)
    .where(
      and(
        eq(messageReceiver
            .messageId, messageId),
        eq(messageReceiver
            .receiverId, receiverId)
      )
    )
    .returning();
}

async deleteMessageReceiver(
  messageId: string,
  receiverId: string
) {
  return await this.db
    .delete(messageReceiver
        
    )
    .where(
      and(
        eq(messageReceiver
            .messageId, messageId),
        eq(messageReceiver
            .receiverId, receiverId)
      )
    )
    .returning();
}
}

