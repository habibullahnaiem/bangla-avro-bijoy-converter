import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * File bytes live in managed object storage. This table only holds the
 * owner-scoped metadata and opaque storage reference needed for the app.
 */
export const storedDocuments = mysqlTable(
  "storedDocuments",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerUserId: int("ownerUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    mimeType: varchar("mimeType", { length: 127 }).notNull(),
    byteSize: int("byteSize").notNull(),
    storageKey: varchar("storageKey", { length: 512 }).notNull().unique(),
    storageUrl: varchar("storageUrl", { length: 768 }).notNull(),
    source: mysqlEnum("source", ["upload", "converted"]).notNull(),
    direction: mysqlEnum("direction", ["u2b", "b2u"]).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("stored_documents_owner_created_idx").on(table.ownerUserId, table.createdAt),
  ],
);

export type StoredDocument = typeof storedDocuments.$inferSelect;
export type InsertStoredDocument = typeof storedDocuments.$inferInsert;
