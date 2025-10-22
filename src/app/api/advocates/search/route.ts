import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { specialties, advocateSpecialties, advocates } from "@/db/schema";
import { sql, eq, or, desc, inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "200");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    let searchResults: any[] = [];
    let totalCount: number;

    if (!query || query.trim() === "") {
      // Return all advocates without filtering when query is null or empty
      searchResults = await db
        .select({
          id: advocates.id,
          firstName: advocates.firstName,
          lastName: advocates.lastName,
          city: advocates.city,
          degree: advocates.degree,
          yearsOfExperience: advocates.yearsOfExperience,
          phoneNumber: advocates.phoneNumber,
          createdAt: advocates.createdAt,
          // Aggregate specialties as JSON array
          specialties: sql<string>`COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'name', ${specialties.name},
                'description', ${specialties.description}
              )
            ) FILTER (WHERE ${specialties.id} IS NOT NULL),
            '[]'::json
          )`,
        })
        .from(advocates)
        .leftJoin(advocateSpecialties, eq(advocates.id, advocateSpecialties.advocateId))
        .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
        .groupBy(
          advocates.id,
          advocates.firstName,
          advocates.lastName,
          advocates.city,
          advocates.degree,
          advocates.yearsOfExperience,
          advocates.phoneNumber,
          advocates.createdAt
        )
        .orderBy(desc(advocates.createdAt))
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const totalCountResult = await db
        .select({ count: sql<number>`count(DISTINCT ${advocates.id})` })
        .from(advocates);
      
      totalCount = totalCountResult[0]?.count || 0;
    } else {
      // Split query into individual words for multi-word search
      const queryWords = query.trim().split(/\s+/).filter(word => word.length > 0);
      
      // First, find matching advocate IDs using tsvector-only multi-word search
      const matchingAdvocateIds = await db
        .selectDistinct({ id: advocates.id })
        .from(advocates)
        .leftJoin(advocateSpecialties, eq(advocates.id, advocateSpecialties.advocateId))
        .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
        .where(
          or(
            // Strategy 1: Full-text search with original query (phrase search)
            sql`${advocates.firstNameVector} @@ plainto_tsquery('english', ${query})`,
            sql`${advocates.lastNameVector} @@ plainto_tsquery('english', ${query})`,
            sql`${advocates.cityVector} @@ plainto_tsquery('english', ${query})`,
            sql`${specialties.searchVector} @@ plainto_tsquery('english', ${query})`,
            
            // Strategy 2: Multi-word search using to_tsquery for better control
            ...(queryWords.length > 1 ? [
              sql`(${advocates.firstNameVector} @@ to_tsquery('english', ${queryWords.join(' & ')}))`,
              sql`(${advocates.lastNameVector} @@ to_tsquery('english', ${queryWords.join(' & ')}))`,
              sql`(${advocates.cityVector} @@ to_tsquery('english', ${queryWords.join(' & ')}))`,
              sql`(${specialties.searchVector} @@ to_tsquery('english', ${queryWords.join(' & ')}))`
            ] : []),
            
            // Strategy 3: First name + last name combinations using tsvector
            ...(queryWords.length === 2 ? [
              sql`(${advocates.firstNameVector} @@ plainto_tsquery('english', ${queryWords[0]}) AND 
                  ${advocates.lastNameVector} @@ plainto_tsquery('english', ${queryWords[1]}))`,
              sql`(${advocates.firstNameVector} @@ plainto_tsquery('english', ${queryWords[1]}) AND 
                  ${advocates.lastNameVector} @@ plainto_tsquery('english', ${queryWords[0]}))`
            ] : []),
            
            // Strategy 4: Individual word matching using tsvector
            ...queryWords.flatMap(word => [
              sql`${advocates.firstNameVector} @@ plainto_tsquery('english', ${word})`,
              sql`${advocates.lastNameVector} @@ plainto_tsquery('english', ${word})`,
              sql`${advocates.cityVector} @@ plainto_tsquery('english', ${word})`,
              sql`${specialties.searchVector} @@ plainto_tsquery('english', ${word})`
            ])
          )
        );

      const advocateIds = matchingAdvocateIds.map(row => row.id);

      if (advocateIds.length === 0) {
        searchResults = [];
      } else {
        // Now get the full advocate data with aggregated specialties and search ranking
        searchResults = await db
          .select({
            id: advocates.id,
            firstName: advocates.firstName,
            lastName: advocates.lastName,
            city: advocates.city,
            degree: advocates.degree,
            yearsOfExperience: advocates.yearsOfExperience,
            phoneNumber: advocates.phoneNumber,
            createdAt: advocates.createdAt,
            searchRank: sql<number>`GREATEST(
              COALESCE(ts_rank(${advocates.firstNameVector}, plainto_tsquery('english', ${query})), 0),
              COALESCE(ts_rank(${advocates.lastNameVector}, plainto_tsquery('english', ${query})), 0),
              COALESCE(ts_rank(${advocates.cityVector}, plainto_tsquery('english', ${query})), 0)
            )`,
            // Aggregate specialties as JSON array
            specialties: sql<string>`COALESCE(
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'name', ${specialties.name},
                  'description', ${specialties.description}
                )
              ) FILTER (WHERE ${specialties.id} IS NOT NULL),
              '[]'::json
            )`,
          })
          .from(advocates)
          .leftJoin(advocateSpecialties, eq(advocates.id, advocateSpecialties.advocateId))
          .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
          .where(inArray(advocates.id, advocateIds))
          .groupBy(
            advocates.id,
            advocates.firstName,
            advocates.lastName,
            advocates.city,
            advocates.degree,
            advocates.yearsOfExperience,
            advocates.phoneNumber,
            advocates.createdAt
          )
          .orderBy(sql`GREATEST(
            COALESCE(ts_rank(${advocates.firstNameVector}, plainto_tsquery('english', ${query})), 0),
            COALESCE(ts_rank(${advocates.lastNameVector}, plainto_tsquery('english', ${query})), 0),
            COALESCE(ts_rank(${advocates.cityVector}, plainto_tsquery('english', ${query})), 0)
          ) DESC`)
          .limit(limit)
          .offset(offset);
      }

      // Get total count for pagination (reuse the advocateIds from above)
      totalCount = advocateIds.length;
    }

    return NextResponse.json({
      query,
      advocates: searchResults,
      totalCount,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error searching advocates:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
