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
} from "drizzle-orm/pg-core";

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
  firstNameVector: text("first_name_vector").generatedAlwaysAs(sql`to_tsvector('english', first_name)`),
  lastNameVector: text("last_name_vector").generatedAlwaysAs(sql`to_tsvector('english', last_name)`),
  cityVector: text("city_vector").generatedAlwaysAs(sql`to_tsvector('english', city)`),
}, (table) => ({
  firstNameVectorIdx: index("advocates_first_name_vector_idx").on(table.firstNameVector),
  lastNameVectorIdx: index("advocates_last_name_vector_idx").on(table.lastNameVector),
  cityVectorIdx: index("advocates_city_vector_idx").on(table.cityVector),
}));

const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  searchVector: text("search_vector").generatedAlwaysAs(sql`to_tsvector('english', name || ' ' || COALESCE(description, ''))`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  searchVectorIdx: index("specialties_search_vector_idx").on(table.searchVector),
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
