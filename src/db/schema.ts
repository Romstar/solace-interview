import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  serial,
  timestamp,
  bigint,
  index,
  primaryKey,
  customType,
} from "drizzle-orm/pg-core";

// Define the custom type for tsvector
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  // Full-text search vectors
  firstNameVector: tsvector("first_name_vector").notNull(),//.generatedAlwaysAs(sql`to_tsvector('english', first_name)`),
  lastNameVector: tsvector("last_name_vector").notNull(),//.generatedAlwaysAs(sql`to_tsvector('english', last_name)`),
  cityVector: tsvector("city_vector").notNull(),//.generatedAlwaysAs(sql`to_tsvector('english', city)`),
}, (table) => ({
  firstNameVectorIdx: index("advocates_first_name_vector_idx").using("gin", sql`to_tsvector('english', ${table.firstName})`),
  lastNameVectorIdx: index("advocates_last_name_vector_idx").using("gin", sql`to_tsvector('english', ${table.lastName})`),
  cityVectorIdx: index("advocates_city_vector_idx").using("gin", sql`to_tsvector('english', ${table.city})`),
}));

const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  searchVector: tsvector("search_vector").notNull(),//.generatedAlwaysAs(sql`to_tsvector('english', name || ' ' || COALESCE(description, ''))`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  searchVectorIdx: index("specialties_search_vector_idx").using("gin", sql`to_tsvector('english', ${table.name} || ' ' || COALESCE(${table.description}, ''))`),
}));

const advocateSpecialties = pgTable("advocate_specialties", {
  advocateId: integer("advocate_id").notNull().references(() => advocates.id, { onDelete: "cascade" }),
  specialtyId: integer("specialty_id").notNull().references(() => specialties.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  pk: primaryKey({ columns: [table.advocateId, table.specialtyId] }),
  advocateIdx: index("advocate_specialties_advocate_id_idx").on(table.advocateId),
  specialtyIdx: index("advocate_specialties_specialty_id_idx").on(table.specialtyId),
}));

export { advocates, specialties, advocateSpecialties };
