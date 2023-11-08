import { relations } from "drizzle-orm";
import { pgTable, bigint, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

// from lucia
export const user = pgTable("auth_user", {
	id: varchar("id", {
		length: 15 // change this when using custom user ids
	}).primaryKey(),

	// other user attributes
  name: varchar("name"),
});

// any line item with amount and category
export const item = pgTable("items", {
  id: uuid("id").defaultRandom().primaryKey(),
  amount: bigint("amount", { mode: "number" }),
  description: varchar("description", { length: 15 }),
  note: varchar("note"),
  category: varchar("category", { enum: ["income", "expense", "savings"] }),
  createdOn: timestamp("createdOn").defaultNow(),
  ownerId: varchar("ownerId").notNull().references(() => user.id, { onDelete: "cascade" })
});

// relationships between models
export const user_relations = relations(user, ({ many }) => ({
  items: many(item)
}));

export const item_relations = relations(item, ({ one }) => ({
  user: one(user, {
    fields: [item.ownerId],
    references: [user.id]
  })
}));

// DO NOT DELETE: for lucia auth
export const session = pgTable("user_session", {
	id: varchar("id", {
		length: 128
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	activeExpires: bigint("active_expires", {
		mode: "number"
	}).notNull(),
	idleExpires: bigint("idle_expires", {
		mode: "number"
	}).notNull()
});

export const key = pgTable("user_key", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar("hashed_password", {
		length: 255
	})
});
