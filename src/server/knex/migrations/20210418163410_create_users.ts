import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('users', (table) => {
    table.uuid('id').notNullable().primary()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.string('fname').notNullable()
    table.string('lname').notNullable()
    table.enu("gender", ["MALE", "FEMALE"]).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('users')
}

