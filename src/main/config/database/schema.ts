import { relations } from 'drizzle-orm';
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
import { timerStatuses } from 'src/timers/domain';

export const badges = pgTable('badges', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  badgeValue: varchar('badgeValue', { length: 100 }).unique().notNull(),
  enabled: boolean('enabled').notNull().default(true),
  description: text('description').notNull(),
});

export const timerStatusEnum = pgEnum('timer_status', timerStatuses);

export const timersTable = pgTable('timers', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  duration: integer('duration').notNull(),
  remaining: integer('remaining'),
  status: timerStatusEnum('status').notNull().default('CREATED'),
  startedAt: timestamp('startedAt', { mode: 'date' }),
  endAt: timestamp('endAt', { mode: 'date' }),
  badgeId: uuid('badgeId')
    .references(() => badges.id, {})
    .notNull(),
});

export const timersRelations = relations(timersTable, ({ one }) => ({
  badge: one(badges, {
    fields: [timersTable.badgeId],
    references: [badges.id],
  }),
}));
