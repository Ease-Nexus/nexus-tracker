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
  jsonb,
} from 'drizzle-orm/pg-core';
import { timerStatuses } from 'src/timers/domain';

export const tableBadges = pgTable('badges', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  badgeValue: varchar('badgeValue', { length: 100 }).unique().notNull(),
  enabled: boolean('enabled').notNull().default(true),
  description: text('description').notNull(),
});

export const timerStatusEnum = pgEnum('timer_status', timerStatuses);

export const timersTable = pgTable('timers', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  duration: integer('duration').notNull(),
  elapsed: integer('elapsed').notNull().default(0),
  status: timerStatusEnum('status').notNull().default('CREATED'),
  startedAt: timestamp('startedAt', { mode: 'date', withTimezone: true }),
  lastStartedAt: timestamp('lastStartedAt', {
    mode: 'date',
    withTimezone: true,
  }),
  history: jsonb('history')
    .$type<
      {
        start: Date;
        end?: Date;
        elapsed: number;
      }[]
    >()
    .notNull()
    .default([]),
  badgeId: uuid('badgeId')
    .references(() => tableBadges.id, {})
    .notNull(),
});

export const timersRelations = relations(timersTable, ({ one }) => ({
  badge: one(tableBadges, {
    fields: [timersTable.badgeId],
    references: [tableBadges.id],
  }),
}));
