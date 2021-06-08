import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('failed_attempts', (table) => {
    table.uuid('id').notNullable().primary()
    table.string('email').notNullable()
    table.integer('attempts').notNullable()
    table.timestamp('used_on')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('failed_attempts')
}

