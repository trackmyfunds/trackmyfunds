import postgres from "postgres";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";

export const query_client = postgres(import.meta.env.DATABASE_URL as string);
export const database = drizzle(query_client, { schema });
