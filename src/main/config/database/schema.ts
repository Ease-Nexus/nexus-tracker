import {
  pgTable,
  boolean,
  varchar,
  text,
  uuid,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const badges = pgTable('badges', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  badgeValue: varchar('badgeValue', { length: 100 }).unique().notNull(),
  enabled: boolean('enabled').notNull().default(true),
  description: text('description').notNull(),
});

export const timerStatusEnum = pgEnum('timer_status', [
  'running',
  'paused',
  'stopped',
]);

export const timers = pgTable('timers', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  badgeId: uuid('badgeId')
    .references(() => badges.id, {})
    .notNull(),
  durationMinutes: integer('durationMinutes').notNull(),
  startTime: timestamp('startTime', { mode: 'date' }).notNull(),
  elapsedSeconds: integer('elapsedSeconds').notNull().default(0),
  status: timerStatusEnum('status').notNull().default('running'),
});
