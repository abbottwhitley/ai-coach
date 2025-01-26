import { create } from "domain";
import { createTableRelationsHelpers } from "drizzle-orm";
import {
    integer,
    numeric,
    text,
    boolean,
    pgTable,
    varchar,
    uuid,
    timestamp,
  } from "drizzle-orm/pg-core";
import { threadId } from "worker_threads";
  
  
  export const Assistant = pgTable("assistant", {
    id: uuid("id").defaultRandom().primaryKey(),
    assistantId: text("assistant_id").notNull(),
  });

  export const UserThread = pgTable("user_thread", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    threadId: text("thread_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  });

  export const UserMeta = pgTable("user_meta", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
  });

  export const UserPromptPreferences = pgTable("challenge_preferences", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: text("challenge_id").notNull(),
    sendNotifications: boolean("send_notifications").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  });

 
  // Export the schema for use in other files
  export type Assistant = typeof Assistant.$inferSelect;
  export type UserThread = typeof UserThread.$inferSelect;
  export type UserPromptPreferences = typeof UserPromptPreferences.$inferSelect;
  export type UserMeta = typeof UserMeta.$inferSelect;