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
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { badgeTypes, transactionTypes } from 'src/modules/management/domain';
import { timerStatuses } from 'src/modules/timers/domain';

// --- Default sizes ---
const CODE_SIZE = 60;
const NAME_SIZE = 100;

// --- Enums ---
export const badgeTypeEnum = pgEnum('badge_type', badgeTypes);

export const timerStatusEnum = pgEnum('timer_status', timerStatuses);

export const transactionTypeEnum = pgEnum('transaction_type', transactionTypes);

// --- Tables ---

export const tenantsTable = pgTable(
  'tenants',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    code: varchar('code', { length: CODE_SIZE }).notNull(),
    name: varchar('name', { length: NAME_SIZE }).notNull(),
    description: text('description'),
    contactInfo: text('contact_info'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('tenants_name_idx').on(table.name)],
);

export const badgesTable = pgTable(
  'badges',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .references(() => tenantsTable.id)
      .notNull(),
    badgeValue: varchar('badgeValue', { length: 100 }).notNull(),
    enabled: boolean('enabled').notNull().default(true),
    description: text('description').notNull(),
    badgeType: badgeTypeEnum('badgeType').notNull().default('CARD'),
    isFixed: boolean('isFixed').notNull().default(false),
  },
  (table) => {
    return [
      uniqueIndex('badges_tenantId_badgeValue_idx').on(
        table.tenantId,
        table.badgeValue,
      ),
    ];
  },
);

export const groupsTable = pgTable(
  'groups',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .references(() => tenantsTable.id)
      .notNull(),
    name: varchar('name', { length: NAME_SIZE }).notNull(),
    description: text('description').notNull(),
    balance: integer('balance').notNull().default(0),
    version: integer('version').notNull().default(0),
    enabled: boolean('enabled').notNull().default(true),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }),
  },
  (table) => {
    return [
      uniqueIndex('groups_tenantId_name_idx').on(table.tenantId, table.name),
    ];
  },
);

export const packagesTable = pgTable(
  'packages',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .references(() => tenantsTable.id)
      .notNull(),
    name: varchar('name', { length: NAME_SIZE }).notNull(),
    description: text('description').notNull(),
    minutes: integer('minutes').notNull(), // Minutos que o pacote oferece
    enabled: boolean('enabled').notNull().default(true),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }),
  },
  (table) => [
    uniqueIndex('packages_tenantId_name_idx').on(table.tenantId, table.name),
  ],
);

export const customersTable = pgTable(
  'customers',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .references(() => tenantsTable.id)
      .notNull(),
    fullName: varchar('fullName', { length: 100 }).notNull(),
    securityNumber: varchar('securityNumber', { length: 100 }).notNull(),
    groupId: uuid('groupId')
      .references(() => groupsTable.id)
      .notNull(),
    fixedBadgeId: uuid('fixedBadgeId').references(() => badgesTable.id), // Renomeado para fixedBadgeId
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }),
  },
  (table) => [
    // Índice composto para busca por securityNumber, único por inquilino
    uniqueIndex('customers_tenantId_securityNumber_idx').on(
      table.tenantId,
      table.securityNumber,
    ),
    // Índice na chave estrangeira para otimizar joins com a tabela groups
    index('customers_groupId_idx').on(table.groupId),
    // Índice na chave estrangeira para crachás fixos
    uniqueIndex('customers_fixedBadgeId_idx').on(table.fixedBadgeId),
  ],
);

export const customerPackagesTable = pgTable(
  'customer_packages',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .references(() => tenantsTable.id)
      .notNull(),
    customerId: uuid('customerId')
      .references(() => customersTable.id)
      .notNull(),
    packageId: uuid('packageId')
      .references(() => packagesTable.id)
      .notNull(),
    renewsAt: timestamp('renewsAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('customer_packages_customerId_idx').on(table.customerId),
    index('customer_packages_packageId_idx').on(table.packageId),
  ],
);

export const transactionsTable = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .notNull()
      .references(() => tenantsTable.id),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groupsTable.id),
    minutesChange: integer('minutes_change').notNull(),
    transactionType: transactionTypeEnum('transaction_type').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('transactions_tenantId_idx').on(table.tenantId),
    index('transactions_group_id_idx').on(table.groupId),
    index('transactions_created_at_idx').on(table.createdAt),
  ],
);

export const sessionsTable = pgTable(
  'sessions',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .references(() => tenantsTable.id)
      .notNull(),
    customerId: uuid('customerId').references(() => customersTable.id),
    badgeId: uuid('badgeId')
      .references(() => badgesTable.id)
      .notNull(),
    startedAt: timestamp('startedAt', { mode: 'date', withTimezone: true }),
    endedAt: timestamp('endedAt', { mode: 'date', withTimezone: true }),
  },
  (table) => [
    // Índices para otimizar joins com customers e badges
    index('sessions_customerId_idx').on(table.customerId),
    index('sessions_badgeId_idx').on(table.badgeId),
    index('sessions_startedAt_idx').on(table.startedAt),
    index('sessions_endedAt_idx').on(table.endedAt),
  ],
);

export const timersTable = pgTable(
  'timers',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .references(() => tenantsTable.id)
      .notNull(),
    sessionId: uuid('sessionId') // Vinculado a uma sessão, não diretamente ao crachá
      .references(() => sessionsTable.id, { onDelete: 'cascade' })
      .notNull(),
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
  },
  (table) => [
    // Índice na chave estrangeira para otimizar joins com a tabela sessions
    index('timers_tenantId_sessionId_idx').on(table.tenantId, table.sessionId),
    index('timers_sessionId_idx').on(table.sessionId),
  ],
);

// --- Relations ---

export const tenantsRelations = relations(tenantsTable, ({ many }) => ({
  groups: many(groupsTable),
}));

export const groupsRelations = relations(groupsTable, ({ many, one }) => ({
  customers: many(customersTable),
  tenant: one(tenantsTable, {
    fields: [groupsTable.tenantId],
    references: [tenantsTable.id],
  }),
}));

export const packagesRelations = relations(packagesTable, ({ many, one }) => ({
  tenant: one(tenantsTable, {
    fields: [packagesTable.tenantId],
    references: [tenantsTable.id],
  }),
  // Um pacote pode estar em muitos vínculos de cliente (customerPackages)
  customerPackages: many(customerPackagesTable),
}));

export const customersRelations = relations(
  customersTable,
  ({ one, many }) => ({
    tenant: one(tenantsTable, {
      fields: [customersTable.tenantId],
      references: [tenantsTable.id],
    }),
    group: one(groupsTable, {
      fields: [customersTable.groupId],
      references: [groupsTable.id],
    }),
    fixedBadge: one(badgesTable, {
      fields: [customersTable.fixedBadgeId],
      references: [badgesTable.id],
    }),
    sessions: many(sessionsTable),
    customerPackages: many(customerPackagesTable),
  }),
);

export const customerPackagesRelations = relations(
  customerPackagesTable,
  ({ one }) => ({
    tenant: one(tenantsTable, {
      fields: [customerPackagesTable.tenantId],
      references: [tenantsTable.id],
    }),
    // Cada vínculo pertence a um cliente
    customer: one(customersTable, {
      fields: [customerPackagesTable.customerId],
      references: [customersTable.id],
    }),
    // Cada vínculo referencia um pacote
    package: one(packagesTable, {
      fields: [customerPackagesTable.packageId],
      references: [packagesTable.id],
    }),
  }),
);

export const badgesRelations = relations(badgesTable, ({ many, one }) => ({
  tenant: one(tenantsTable, {
    fields: [badgesTable.tenantId],
    references: [tenantsTable.id],
  }),
  customers: many(customersTable),
  sessions: many(sessionsTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  tenant: one(tenantsTable, {
    fields: [sessionsTable.tenantId],
    references: [tenantsTable.id],
  }),
  customer: one(customersTable, {
    fields: [sessionsTable.customerId],
    references: [customersTable.id],
  }),
  badge: one(badgesTable, {
    fields: [sessionsTable.badgeId],
    references: [badgesTable.id],
  }),
  timer: one(timersTable, {
    fields: [sessionsTable.id],
    references: [timersTable.sessionId],
  }),
}));

export const timersRelations = relations(timersTable, ({ one }) => ({
  tenant: one(tenantsTable, {
    fields: [timersTable.tenantId],
    references: [tenantsTable.id],
  }),
  session: one(sessionsTable, {
    fields: [timersTable.sessionId],
    references: [sessionsTable.id],
  }),
}));

export const transactionsRelations = relations(
  transactionsTable,
  ({ one }) => ({
    tenant: one(tenantsTable, {
      fields: [transactionsTable.tenantId],
      references: [tenantsTable.id],
    }),
    group: one(groupsTable, {
      fields: [transactionsTable.groupId],
      references: [groupsTable.id],
    }),
  }),
);
