DROP INDEX IF EXISTS "advocates_first_name_vector_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "advocates_last_name_vector_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "advocates_city_vector_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "specialties_search_vector_idx";--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "first_name_vector" SET DATA TYPE tsvector;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "first_name_vector" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "first_name_vector" DROP EXPRESSION;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "last_name_vector" SET DATA TYPE tsvector;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "last_name_vector" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "last_name_vector" DROP EXPRESSION;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "city_vector" SET DATA TYPE tsvector;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "city_vector" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "city_vector" DROP EXPRESSION;--> statement-breakpoint
ALTER TABLE "specialties" ALTER COLUMN "search_vector" SET DATA TYPE tsvector;--> statement-breakpoint
ALTER TABLE "specialties" ALTER COLUMN "search_vector" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "specialties" ALTER COLUMN "search_vector" DROP EXPRESSION;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_first_name_vector_idx" ON "advocates" USING gin (to_tsvector('english', "first_name"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_last_name_vector_idx" ON "advocates" USING gin (to_tsvector('english', "last_name"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_city_vector_idx" ON "advocates" USING gin (to_tsvector('english', "city"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "specialties_search_vector_idx" ON "specialties" USING gin (to_tsvector('english', "name" || ' ' || COALESCE("description", '')));