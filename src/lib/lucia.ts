import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { google } from "@lucia-auth/oauth/providers";
import { postgres as pg_adapter } from "@lucia-auth/adapter-postgresql";

import { query_client } from "./drizzle";

export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: astro(),
  adapter: pg_adapter(query_client, {
    user: "auth_user",
    key: "user_key",
    session: "user_session",
  }),

  getUserAttributes: (data) => {
    return {
      name: data.name
    }
  }
});

export const google_auth = google(auth, {
  clientId: import.meta.env.GOOGLE_CLIENT_ID as string,
  clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET as string,
  redirectUri: import.meta.env.DEV ? "http://localhost:4321/auth/google/callback" : "https://trackmyfunds.netlify.app/auth/google/callback",
});

export type Auth = typeof auth;
