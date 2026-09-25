export type ConversationType =
  | "DIRECT"
  | "GROUP";

export interface Conversation {
  conversationId: string;
  type: ConversationType;
  name: string;
  profileUrl: string;
  membersCount: number;
  createdAt?: number | null;
  firstMemberId?: string | null;
  secondMemberId?: string | null;
  creatorId?: string | null;
}

export interface ConversationAdmin {
  conversationId: string;
  adminId: string;
}

export interface ConversationMember {
  conversationId: string;
  memberId: string;
}