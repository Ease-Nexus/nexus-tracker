CREATE TYPE "public"."badge_type" AS ENUM('CARD', 'BRACELET', 'DIGITAL');--> statement-breakpoint
CREATE TYPE "public"."timer_status" AS ENUM('CREATED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('CREDIT', 'DEBIT');--> statement-breakpoint
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
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"fullName" varchar(100) NOT NULL,
	"securityNumber" varchar(100) NOT NULL,
	"groupId" uuid NOT NULL,
	"fixedBadgeId" uuid,
	"createdAt" timestamp with time zone
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
	"customerId" uuid NOT NULL,
	"badgeId" uuid NOT NULL,
	"startedAt" timestamp with time zone,
	"endedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(60) NOT NULL,
	"name" varchar(100) NOT NULL,
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
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"minutes_change" integer NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_fixedBadgeId_badges_id_fk" FOREIGN KEY ("fixedBadgeId") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_badgeId_badges_id_fk" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timers" ADD CONSTRAINT "timers_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timers" ADD CONSTRAINT "timers_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "badges_tenantId_badgeValue_idx" ON "badges" USING btree ("tenantId","badgeValue");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_tenantId_securityNumber_idx" ON "customers" USING btree ("tenantId","securityNumber");--> statement-breakpoint
CREATE INDEX "customers_groupId_idx" ON "customers" USING btree ("groupId");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_fixedBadgeId_idx" ON "customers" USING btree ("fixedBadgeId");--> statement-breakpoint
CREATE UNIQUE INDEX "groups_tenantId_name_idx" ON "groups" USING btree ("tenantId","name");--> statement-breakpoint
CREATE INDEX "sessions_customerId_idx" ON "sessions" USING btree ("customerId");--> statement-breakpoint
CREATE INDEX "sessions_badgeId_idx" ON "sessions" USING btree ("badgeId");--> statement-breakpoint
CREATE INDEX "sessions_startedAt_idx" ON "sessions" USING btree ("startedAt");--> statement-breakpoint
CREATE INDEX "sessions_endedAt_idx" ON "sessions" USING btree ("endedAt");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_name_idx" ON "tenants" USING btree ("name");--> statement-breakpoint
CREATE INDEX "timers_tenantId_sessionId_idx" ON "timers" USING btree ("tenantId","sessionId");--> statement-breakpoint
CREATE INDEX "timers_sessionId_idx" ON "timers" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "transactions_tenantId_idx" ON "transactions" USING btree ("tenantId");--> statement-breakpoint
CREATE INDEX "transactions_group_id_idx" ON "transactions" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");