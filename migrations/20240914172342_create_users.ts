import type { Knex } from "knex";


export const up = (knex: Knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('username').notNullable().unique()
    table.string('password').notNullable()
  })
}

export const down = (knex: Knex) => {
  return knex.schema.dropTable('users')
}


