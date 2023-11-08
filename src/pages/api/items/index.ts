import { eq, desc } from "drizzle-orm";
import { database } from "../../../lib/drizzle";
import * as schema from "../../../lib/schema";

export async function GET(context) {
  const session = await context.locals.auth.validate();
  console.log({ session });
  if (!session) { return new Response("Unauthorized", { status: 402 }); }

  const user = session.user;
  
  // try catch
  const items = await database.query.item.findMany({
    where: eq(schema.item.ownerId, user.userId),
    orderBy: desc(schema.item.createdOn)
  });

  return new Response(
    JSON.stringify({ items }), {
      status: 200
    }
  );
};

export async function POST({ params, request }) {
  const data = await request.json();
  const user_id = data.user_id;
  const amount = data.amount;
  const category = data.category;

  // try catch
  await database.insert(schema.item).values({
    ownerId: user_id,
    amount,
    category
  });

  return new Response(null, { status: 200 });
}
