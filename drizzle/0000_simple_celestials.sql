CREATE TYPE "public"."badge_type" AS ENUM('CARD', 'BRACELET', 'DIGITAL');--> statement-breakpoint
CREATE TYPE "public"."timer_status" AS ENUM('CREATED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELED');--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"badgeValue" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"description" text NOT NULL,
	"badgeType" "badge_type" DEFAULT 'CARD' NOT NULL,
	"isFixed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"badgeId" uuid NOT NULL,
	"startedAt" timestamp with time zone,
	"endedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(60) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"contact_info" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"sessionId" uuid NOT NULL,
	"duration" integer NOT NULL,
	"elapsed" integer DEFAULT 0 NOT NULL,
	"status" timer_status DEFAULT 'CREATED' NOT NULL,
	"startedAt" timestamp with time zone,
	"lastStartedAt" timestamp with time zone,
	"history" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"fullName" varchar(100) NOT NULL,
	"securityNumber" varchar(100) NOT NULL,
	"groupId" uuid NOT NULL,
	"fixedBadgeId" uuid,
	"createdAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_badgeId_badges_id_fk" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timers" ADD CONSTRAINT "timers_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timers" ADD CONSTRAINT "timers_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_fixedBadgeId_badges_id_fk" FOREIGN KEY ("fixedBadgeId") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "badges_tenantId_badgeValue_idx" ON "badges" USING btree ("tenantId","badgeValue");--> statement-breakpoint
CREATE UNIQUE INDEX "groups_tenantId_name_idx" ON "groups" USING btree ("tenantId","name");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessions_badgeId_idx" ON "sessions" USING btree ("badgeId");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_name_idx" ON "tenants" USING btree ("name");--> statement-breakpoint
CREATE INDEX "timers_sessionId_idx" ON "timers" USING btree ("sessionId");--> statement-breakpoint
CREATE UNIQUE INDEX "users_tenantId_securityNumber_idx" ON "users" USING btree ("tenantId","securityNumber");--> statement-breakpoint
CREATE INDEX "users_groupId_idx" ON "users" USING btree ("groupId");--> statement-breakpoint
CREATE UNIQUE INDEX "users_fixedBadgeId_idx" ON "users" USING btree ("fixedBadgeId");