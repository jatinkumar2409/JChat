import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

/* ---------------- Conversation ---------------- */

export const conversations = sqliteTable("conversations", {
  conversationId: text("conversation_id").primaryKey(),

  type: text("type").notNull(),

  name: text("name").notNull(),

  profileUrl: text("profile_url").notNull(),

  membersCount: integer("members_count").notNull(),

  createdAt: integer("created_at").notNull(),

  firstMemberId: text("first_member_id"),

  secondMemberId: text("second_member_id"),

  creatorId: text("creator_id"),
});


/* ---------------- Conversation Admin ---------------- */

export const conversationAdmins = sqliteTable("conversation_admins", {
  conversationId: text("conversation_id").notNull(),

  adminId: text("admin_id").notNull(),
});


/* ---------------- Conversation Member ---------------- */

export const conversationMembers = sqliteTable("conversation_members", {
  conversationId: text("conversation_id").notNull(),

  memberId: text("member_id").notNull(),
});


/* ---------------- Message Metadata ---------------- */

export const messageMetadata = sqliteTable("message_metadata", {
  messageId: text("message_id").primaryKey(),

  conversationId: text("conversation_id").notNull(),

  senderId: text("sender_id").notNull(),

  type: text("type").notNull(),

  /*
   * This depends on what Message actually contains.
   * If Message is a polymorphic/sealed Kotlin class,
   * don't store it as a simple text column without
   * deciding on a serialization format.
   */
  message: text("message").notNull(),

  sentAt: integer("sent_at").notNull(),

  deletedAt: integer("deleted_at"),

  version: integer("version").notNull().default(1),
});


/* ---------------- Message Receiver ---------------- */

export const messageReceiver = sqliteTable("message_receivers", {
  messageId: text("message_id").notNull(),

  conversationId: text("conversation_id").notNull(),

  receiverId: text("receiver_id").notNull(),

  deliveredAt: integer("delivered_at"),

  receivedAt: integer("received_at"),
});