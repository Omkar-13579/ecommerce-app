
import {
  pgTable,
  text,
  integer,
  serial,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const cartItem = pgTable(
  "cart_item",
  {
    id: serial("id").primaryKey(),
    cartId: integer("cart_id")
      .notNull()
      .references(() => cart.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull(),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (table) => [
    unique().on(table.cartId, table.productId),
  ],
);
