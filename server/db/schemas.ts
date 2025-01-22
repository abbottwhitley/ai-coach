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


 
  // Export the schema for use in other files
  export type Assistant = typeof Assistant.$inferSelect;
  export type UserThread = typeof UserThread.$inferSelect;
