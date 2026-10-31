import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

const result = dotenv.config({ path: ".env.local" });

if (result.error) {
  throw result.error;
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});