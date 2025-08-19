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

export const groupsTable = pgTable('groups', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  balance: integer('balance').notNull().default(0),
  version: integer('version').notNull().default(0),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }),
});

export const usersTable = pgTable('users', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  fullName: varchar('fullName', { length: 100 }).notNull(),
  securityNumber: varchar('securityNumber', { length: 100 }).notNull(),
  groupId: uuid('groupId')
    .references(() => groupsTable.id)
    .notNull(),
  badgeId: uuid('badgeId').references(() => badgesTable.id),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }),
});

export const badgeTypeEnum = pgEnum('badge_type', [
  'CARD',
  'BRACELET',
  'DIGITAL',
] as const);

export const badgesTable = pgTable('badges', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  badgeValue: varchar('badgeValue', { length: 100 }).unique().notNull(),
  enabled: boolean('enabled').notNull().default(true),
  description: text('description').notNull(),
  badgeType: badgeTypeEnum('badgeType').notNull().default('CARD'),
  isFixed: boolean('isFixed').notNull().default(false),
});

export const sessionsTable = pgTable('sessions', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  userId: uuid('userId')
    .references(() => usersTable.id)
    .notNull(),
  badgeId: uuid('badgeId')
    .references(() => badgesTable.id)
    .notNull(),
  startedAt: timestamp('startedAt', { mode: 'date', withTimezone: true }),
  endedAt: timestamp('endedAt', { mode: 'date', withTimezone: true }),
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
    .references(() => badgesTable.id, {})
    .notNull(),
});

export const timersRelations = relations(timersTable, ({ one }) => ({
  badge: one(badgesTable, {
    fields: [timersTable.badgeId],
    references: [badgesTable.id],
  }),
}));
