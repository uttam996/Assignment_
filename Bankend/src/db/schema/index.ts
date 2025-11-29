import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const role = pgEnum("role", ["EMPLOYEE", "MANAGER"]);


export const UserSchema = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: role("role").notNull(),
  password: text("password").notNull(),
  manager_id: uuid("manager_id").references(() => UserSchema.id),
  token: text("token"),
});


export const status = pgEnum("status", ["CREATED", "APPROVED", "REJECTED", "CLOSED"]);
export const RequestSchema = pgTable("requests", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: status("status").notNull().default("CREATED"),
  created_by: uuid("created_by").references(() => UserSchema.id).notNull(),
  assigned_to: uuid("assigned_to").references(() => UserSchema.id).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const RequestSchemaLog = pgTable("request_logs", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  request_id: uuid("request_id").references(() => RequestSchema.id),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  created_by: uuid("created_by").references(() => UserSchema.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
