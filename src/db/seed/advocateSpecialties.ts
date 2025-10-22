import db from "..";
import { advocates, specialties, advocateSpecialties } from "../schema";
import { eq, sql } from "drizzle-orm";
import { specialtiesData } from "./specialties";

const randomSpecialty = () => {
  const random1 = Math.floor(Math.random() * (specialtiesData.length - 1));
  const random2 = Math.floor(Math.random() * (specialtiesData.length - random1)) + random1 + 1;
  return [random1, random2];
};

const seedAdvocateSpecialties = async () => {
  console.log("Seeding advocate-specialty relationships...");
  
  try {
    // Get all advocates
    const allAdvocates = await db.select().from(advocates);
    console.log(`Found ${allAdvocates.length} advocates`);
    
    // Get all specialties
    const allSpecialties = await db.select().from(specialties);
    console.log(`Found ${allSpecialties.length} specialties`);
    
    // Create a map of specialty names to IDs for quick lookup
    const specialtyMap = new Map();
    allSpecialties.forEach(specialty => {
      specialtyMap.set(specialty.name, specialty.id);
    });
    
    const relationships = [];
    let processedCount = 0;
    
    // Process each advocate
    for (const advocate of allAdvocates) {
      // Generate random specialties for each advocate (1-3 specialties)
      const [startIdx, endIdx] = randomSpecialty();
      const advocateSpecialtiesList = specialtiesData.slice(startIdx, endIdx);
      
      for (const specialtyName of advocateSpecialtiesList) {
        const specialtyId = specialtyMap.get(specialtyName);
        
        if (specialtyId) {
          relationships.push({
            advocateId: advocate.id,
            specialtyId: specialtyId,
          });
        } else {
          console.warn(`Specialty "${specialtyName}" not found for advocate ${advocate.id}`);
        }
      }
      
      processedCount++;
      if (processedCount % 1000 === 0) {
        console.log(`Processed ${processedCount} advocates...`);
      }
    }
    
    console.log(`Creating ${relationships.length} advocate-specialty relationships...`);
    
    // Insert relationships in batches to avoid memory issues
    const batchSize = 1000;
    for (let i = 0; i < relationships.length; i += batchSize) {
      const batch = relationships.slice(i, i + batchSize);
      await db.insert(advocateSpecialties).values(batch).onConflictDoNothing();
      
      if (i + batchSize < relationships.length) {
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(relationships.length / batchSize)}`);
      }
    }
    
    console.log(`Successfully created ${relationships.length} advocate-specialty relationships`);
  } catch (error) {
    console.error("Error seeding advocate-specialty relationships:", error);
    throw error;
  }
};

export default seedAdvocateSpecialties;
