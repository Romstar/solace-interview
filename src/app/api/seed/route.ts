import seedAdvocates from "../../../db/seed/advocates";
import seedSpecialties from "../../../db/seed/specialties";
import seedAdvocateSpecialties from "../../../db/seed/advocateSpecialties";

export async function POST() {
  try {
    console.log("Starting database seeding...");
    
    // Seed specialties first (they might be referenced by advocates)
    await seedSpecialties();
    
    // Then seed advocates
    await seedAdvocates();
    
    // Finally, create the advocate-specialty relationships
    await seedAdvocateSpecialties();
    
    console.log("Database seeding completed successfully!");
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return Response.json(
      { error: "Failed to seed database", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
