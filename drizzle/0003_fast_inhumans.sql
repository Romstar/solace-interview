ALTER TABLE "advocates" ADD COLUMN "first_name_vector" text GENERATED ALWAYS AS (to_tsvector('english', first_name)) STORED;--> statement-breakpoint
ALTER TABLE "advocates" ADD COLUMN "last_name_vector" text GENERATED ALWAYS AS (to_tsvector('english', last_name)) STORED;--> statement-breakpoint
ALTER TABLE "advocates" ADD COLUMN "city_vector" text GENERATED ALWAYS AS (to_tsvector('english', city)) STORED;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_first_name_vector_idx" ON "advocates" USING gin ("first_name_vector");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_last_name_vector_idx" ON "advocates" USING gin ("last_name_vector");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_city_vector_idx" ON "advocates" USING gin ("city_vector");