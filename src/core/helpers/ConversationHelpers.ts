import { conversations } from "../sqlite/database/schema";
import { Conversation , ConversationType } from "../models/Conversation";
import * as Crypto from "expo-crypto";
export function toConversationType(value: string): ConversationType {
    switch (value) {
        case "DIRECT":
            return "DIRECT";

        case "GROUP":
            return "GROUP";

        default:
            throw new Error(
                `Invalid ConversationType: ${value}`
            );
    }
}

export function toConversationModel(
    row: typeof conversations.$inferSelect
): Conversation {
    return {
        conversationId: row.conversationId,
        type: toConversationType(row.type),
        name: row.name,
        profileUrl: row.profileUrl,
        membersCount: row.membersCount,
        createdAt: row.createdAt,
        firstMemberId: row.firstMemberId,
        secondMemberId: row.secondMemberId,
        creatorId: row.creatorId,
    };
}


export async function createConversationId(
  userId1: string,
  userId2: string
): Promise<string> {
  const [first, second] = [userId1, userId2].sort();

  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${first}:${second}`
  );
}

