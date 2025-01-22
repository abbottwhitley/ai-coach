import { db } from './db/drizzle';
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { UserThread } from '@/server/db/schemas';
import { v4 as uuidv4 } from 'uuid';

// export async function addUserThread(userThread: Omit<UserThread, 'id' | 'thread'>) {
//   try {
//     const newUserThread: UserThread = {
//       ...userThread,
//       id: uuidv4(),
//       userId: ,
//       threadId: ,
//       createdAt: ,

//     };

//     const [insertedJob] = await db.insert(UserThread).values(newJobPosting).returning();
//     return insertedJob;
//   } catch (error) {
//     throw new Error('Failed to add job posting');
//   }
// }


export const getUserThread = async (): Promise<UserThread[]> => {
  // const { userId } = await auth();
  const userId = "abbottjc"

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return db.select().from(UserThread).where(eq(UserThread.userId, userId));
};