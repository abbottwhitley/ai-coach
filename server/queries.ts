import { db } from './db/drizzle';
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { UserThread } from '@/server/db/schemas';
import { v4 as uuidv4 } from 'uuid';

export const getUserThread = async (userId: string): Promise<UserThread | null> => {
  if (!userId) {
    throw new Error("User ID is required")
  }

  const userThreads = await db.select().from(UserThread).where(eq(UserThread.userId, userId)).limit(1)
  return userThreads.length > 0 ? userThreads[0] : null
}

export const addUserThread = async (userId: string, threadId: string): Promise<UserThread> => {
  if (!userId || !threadId) {
    throw new Error("User ID and Thread ID are required")
  }

  const newUserThread = {
    id: uuidv4(),
    userId,
    threadId,
    createdAt: new Date(),
  }

  const [insertedUserThread] = await db.insert(UserThread).values(newUserThread).returning()
  return insertedUserThread
}