import knex from 'knex'

const knexConfig = require('../knexfile')

const db = knex(knexConfig)

export default db


// TODO:
// LAST PART OF STEP 2.
// Run the migrations:
// npx knex migrate:latest
// RUN THIS COMMAND TO MIGRATE.