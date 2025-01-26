import { db } from './db/drizzle';
import { eq, and, desc, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { Assistant, UserThread, UserPromptPreferences, UserMeta } from '@/server/db/schemas';
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

export const getAssistants = async (): Promise<Assistant | null> => {

  const assistant = await db.select().from(Assistant).limit(1)
  return assistant.length > 0 ? assistant[0] : null
}

export const getUserPromptPreferences = async (userId: string): Promise<UserPromptPreferences | null> => {
  if (!userId) {
    throw new Error("User ID is required")
  }

  const userPromptPreferences = await db.select().from(UserPromptPreferences).where(eq(UserPromptPreferences.userId, userId)).limit(1)
  return userPromptPreferences.length > 0 ? userPromptPreferences[0] : null
}

export const addUserPromptPreferences  = async (userId: string, challengeId: string, sendNotifications=true): Promise<UserPromptPreferences> => {
  if (!userId || !challengeId) {
    throw new Error("User ID and Prompt Frequency are required")
  }

  const newPromptPreferences = {
    id: uuidv4(),
    userId,
    challengeId,
    sendNotifications,
    createdAt: new Date(),
  }

  const [insertedPromptPreferences] = await db.insert(UserPromptPreferences)
                                        .values(newPromptPreferences)
                                        .returning()
  return insertedPromptPreferences
}

export const updateUserPromptPreferences  = async (userId: string, challengeId: string, sendNotifications: true): Promise<UserPromptPreferences> => {
  if (!userId || !challengeId) {
    throw new Error("User ID and Prompt Frequency are required")
  }

  const updatedPromptPreferences = await db.update(UserPromptPreferences)
                                          .set({
                                            challengeId: challengeId, 
                                            sendNotifications: sendNotifications
                                          })
                                          .where(eq(UserPromptPreferences.userId, userId))
                                          .returning()
                                          .then(res => res[0])

  return updatedPromptPreferences
}

export const getUserMetaMany = async (userIds: string[]): Promise<UserMeta[]> => {
  if (!userIds) {
    throw new Error("User ID is required")
  }

  const userMetas = await db.select()
                          .from(UserMeta)
                          .where(
                            inArray(
                              UserMeta.userId, userIds
                            ));
  return userMetas
}

export const getUserPromptPreferencesMany = async (challengeId: string): Promise<UserPromptPreferences[]> => {
  if (!challengeId) {
    throw new Error("Challeng ID is required")
  }

  const userPromptPreferences = await db.select()
                                    .from(UserPromptPreferences)
                                    .where(
                                      eq(
                                        UserPromptPreferences.challengeId, 
                                        challengeId
                                      ))
                                    .limit(1)
  return userPromptPreferences
}

export const getUserThreadMany = async (userIds: string[]): Promise<UserThread[]> => {
  if (!userIds) {
    throw new Error("User ID is required")
  }

  // userThread.userId, ["unew_user_id", "user_2rqyHVz4Jq8ftrDhPfpnRk8g7pe"]
  const userThreads = await db.select()
                          .from(UserThread)
                          .where(
                            inArray(
                              UserThread.userId, userIds
                            ));
  return userThreads
}
