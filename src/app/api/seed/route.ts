import db from "../../../db";
import { advocates } from "../../../db/schema";
import { generateRandomAdvocates } from "../../../db/seed/advocates";

export async function POST() {
  try {
    
    for (let i = 0; i < 10; i++) {
      const advocateData = generateRandomAdvocates(5000);
      
      const result = await db.insert(advocates).values(advocateData).onConflictDoNothing(); 
    }
    
    return Response.json({ message: "Advocates seeded successfully" });
  } catch (error) {
    console.error("Error seeding advocates:", error);
    return Response.json(
      { error: "Failed to seed advocates", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
