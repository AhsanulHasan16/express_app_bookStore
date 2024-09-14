import { Knex } from "knex"

export const up = (knex: Knex) => {
  return knex.schema.createTable('authors', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.text('bio')
    table.date('birthdate').notNullable()
  })
}

export const down = (knex: Knex) => {
  return knex.schema.dropTable('authors')
}
