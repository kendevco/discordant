import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

/** Default include configuration for conversation queries */
const defaultIncludes = {
  memberOne: {
    include: {
      profile: true,
    },
  },
  memberTwo: {
    include: {
      profile: true,
    },
  },
  directMessages: true,
  _count: true,
} satisfies Prisma.ConversationInclude;

/**
 * Get an existing conversation between two members or create a new one
 * @param memberOneId - ID of the first member
 * @param memberTwoId - ID of the second member
 * @param options - Optional include configuration
 * @returns The conversation with included relations, or null if creation fails
 */
export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string,
  options: Prisma.ConversationInclude = defaultIncludes
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId, options)) ||
    (await findConversation(memberTwoId, memberOneId, options));

  if (!conversation) {
    conversation = await createNewConversation(
      memberOneId,
      memberTwoId,
      options
    );
  }

  return conversation;
};

/**
 * Find an existing conversation between two members
 * @param memberOneId - ID of the first member
 * @param memberTwoId - ID of the second member
 * @param options - Optional include configuration
 * @returns The conversation if found, null otherwise
 */
const findConversation = async (
  memberOneId: string,
  memberTwoId: string,
  options: Prisma.ConversationInclude = defaultIncludes
) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: options,
    });
  } catch {
    return null;
  }
};

/**
 * Create a new conversation between two members
 * @param memberOneId - ID of the first member
 * @param memberTwoId - ID of the second member
 * @param options - Optional include configuration
 * @returns The created conversation, or null if creation fails
 */
const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string,
  options: Prisma.ConversationInclude = defaultIncludes
) => {
  try {
    return await db.conversation.create({
      data: {
        id: randomUUID(),
        memberOneId,
        memberTwoId,
      },
      include: defaultIncludes,
    });
  } catch {
    return null;
  }
};
