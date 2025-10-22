import db from "..";
import { specialties } from "../schema";
import { sql, eq } from "drizzle-orm";

const specialtiesData = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const seedSpecialties = async () => {
  console.log("Seeding specialties...");
  
  try {
    const insertedSpecialties = [];
    
    // Insert specialties if they don't exist
    for (const specialtyName of specialtiesData) {
      const result = await db.insert(specialties).values({
        name: specialtyName,
        description: null,
      }).onConflictDoNothing().returning();
      
      if (result.length > 0) {
        insertedSpecialties.push(result[0]);
      } else {
        // If specialty already exists, fetch it
        const existing = await db.select().from(specialties).where(eq(specialties.name, specialtyName)).limit(1);
        if (existing.length > 0) {
          insertedSpecialties.push(existing[0]);
        }
      }
    }
    
    console.log(`Successfully seeded ${specialtiesData.length} specialties`);
    return insertedSpecialties;
  } catch (error) {
    console.error("Error seeding specialties:", error);
    throw error;
  }
};

export default seedSpecialties;
export { specialtiesData };
