CREATE TYPE "public"."timer_status" AS ENUM('running', 'paused', 'stopped');--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"badgeId" uuid NOT NULL,
	"durationMinutes" integer NOT NULL,
	"startTime" timestamp NOT NULL,
	"elapsedSeconds" integer DEFAULT 0 NOT NULL,
	"status" timer_status DEFAULT 'running' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "timers" ADD CONSTRAINT "timers_badgeId_badges_id_fk" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;