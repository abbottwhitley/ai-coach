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


//   // Schema definitions
//   export const JobListings = pgTable("job_listings", {
//     id: uuid("id").defaultRandom().primaryKey(),
//     jobTitle: text("job_title").notNull(),
//     jobId: text("job_id").notNull(),
//     description: text("description"),
//     payRate: numeric("pay_rate").notNull(),
//     jobType: text("job_type").notNull(),
//     basicQualifications: text("basic_qualifications").notNull(),
//     desiredSkills: text("desired_skills").notNull(),
//     workSchedule: text("work_schedule").notNull(),
//     physicalDemand: text("physical_demand").notNull(),
//     publishedAt: timestamp("published_at").notNull(),
//   });
  
  // Export the schema for use in other files
  export type Assistant = typeof Assistant.$inferSelect;
  export type UserThread = typeof UserThread.$inferSelect;
