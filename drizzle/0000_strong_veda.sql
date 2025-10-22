CREATE TABLE IF NOT EXISTS "advocates" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"city" text NOT NULL,
	"degree" text NOT NULL,
	"payload" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"years_of_experience" integer NOT NULL,
	"phone_number" bigint NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "specialties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"search_vector" text GENERATED ALWAYS AS (to_tsvector('english', name || ' ' || COALESCE(description, ''))) STORED,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "specialties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "specialties_search_vector_idx" ON "specialties" USING gin ("search_vector");