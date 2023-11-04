import { auth, google_auth } from "../../../lib/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import type { APIRoute } from "astro";

export const get : APIRoute = async (context) => {
  const stored_state = context.cookies.get("google_oauth_state")?.value;
  const state = context.url.searchParams.get("state");
  const code = context.url.searchParams.get("code");

  if (!stored_state || !state || stored_state !== state || !code) {
    return new Response(null, { status: 400 });
  }

  try {
    const { getExistingUser, googleUser, createUser } = 
      await google_auth.validateCallback(code);

    const getUser = async () => {
      const existing_user = await getExistingUser();
      if (existing_user) return existing_user;

      const user = await createUser({
        attributes: {
          name: googleUser.name
        }
      });

      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    });

    context.locals.auth.setSession(session);
    return context.redirect("/dashboard", 302);
  }
  catch (e) {
    if (e instanceof OAuthRequestError) {
      return new Response(null, { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}
