import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const labelTemplates = pgTable("label_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("address"),
  fields: jsonb("fields").notNull(),
  fontFamily: text("font_family").notNull().default("Arial"),
  fontSize: integer("font_size").notNull().default(10),
  textColor: text("text_color").notNull().default("#000000"),
  textAlign: text("text_align").notNull().default("left"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  labelsGenerated: integer("labels_generated").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
