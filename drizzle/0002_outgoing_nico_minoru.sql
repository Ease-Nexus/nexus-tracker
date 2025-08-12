ALTER TABLE "badges" RENAME COLUMN "value" TO "badgeValue";--> statement-breakpoint
ALTER TABLE "badges" DROP CONSTRAINT "badges_value_unique";--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_badgeValue_unique" UNIQUE("badgeValue");