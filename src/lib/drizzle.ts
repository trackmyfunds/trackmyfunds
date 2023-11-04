import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";

export const query_client = postgres(import.meta.env.DATABASE_URL as string);
export const database : PostgresJsDatabase = drizzle(query_client);
