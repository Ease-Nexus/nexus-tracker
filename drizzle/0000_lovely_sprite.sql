CREATE TYPE "public"."timer_status" AS ENUM('CREATED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELED');--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"badgeValue" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "badges_badgeValue_unique" UNIQUE("badgeValue")
);
--> statement-breakpoint
CREATE TABLE "timers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"duration" integer NOT NULL,
	"elapsed" integer DEFAULT 0 NOT NULL,
	"status" timer_status DEFAULT 'CREATED' NOT NULL,
	"startedAt" timestamp with time zone,
	"lastStartedAt" timestamp with time zone,
	"history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"badgeId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "timers" ADD CONSTRAINT "timers_badgeId_badges_id_fk" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;