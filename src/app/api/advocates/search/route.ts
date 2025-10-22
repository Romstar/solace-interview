import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { specialties, advocateSpecialties, advocates } from "@/db/schema";
import { sql, eq, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    // Search advocates across specialties, firstName, lastName, and city
    const searchResults = await db
      .select({
        id: advocates.id,
        firstName: advocates.firstName,
        lastName: advocates.lastName,
        city: advocates.city,
        degree: advocates.degree,
        yearsOfExperience: advocates.yearsOfExperience,
        phoneNumber: advocates.phoneNumber,
        createdAt: advocates.createdAt,
        // Include specialty information for context
        specialtyName: specialties.name,
        specialtyDescription: specialties.description,
      })
      .from(advocates)
      .leftJoin(advocateSpecialties, eq(advocates.id, advocateSpecialties.advocateId))
      .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
      .where(
        or(
          // Search in advocate fields
          sql`${advocates.firstNameVector} @@ plainto_tsquery('english', ${query})`,
          sql`${advocates.lastNameVector} @@ plainto_tsquery('english', ${query})`,
          sql`${advocates.cityVector} @@ plainto_tsquery('english', ${query})`,
          // Search in specialty fields
          sql`${specialties.searchVector} @@ plainto_tsquery('english', ${query})`
        )
      )
      .orderBy(
        sql`GREATEST(
          COALESCE(ts_rank(${advocates.firstNameVector}, plainto_tsquery('english', ${query})), 0),
          COALESCE(ts_rank(${advocates.lastNameVector}, plainto_tsquery('english', ${query})), 0),
          COALESCE(ts_rank(${advocates.cityVector}, plainto_tsquery('english', ${query})), 0),
          COALESCE(ts_rank(${specialties.searchVector}, plainto_tsquery('english', ${query})), 0)
        ) DESC`
      )
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(DISTINCT ${advocates.id})` })
      .from(advocates)
      .leftJoin(advocateSpecialties, eq(advocates.id, advocateSpecialties.advocateId))
      .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
      .where(
        or(
          sql`${advocates.firstNameVector} @@ plainto_tsquery('english', ${query})`,
          sql`${advocates.lastNameVector} @@ plainto_tsquery('english', ${query})`,
          sql`${advocates.cityVector} @@ plainto_tsquery('english', ${query})`,
          sql`${specialties.searchVector} @@ plainto_tsquery('english', ${query})`
        )
      );
    
    const totalCount = totalCountResult[0]?.count || 0;

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
