import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET() {
  // Uncomment this line to use a database
  try {
    const data = await db.select().from(advocates).limit(200).offset(0);
    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json({ error: "Failed to fetch advocates" }, { status: 500 });
  }
}
