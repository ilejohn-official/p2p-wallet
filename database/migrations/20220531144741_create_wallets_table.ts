import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('wallets', function (table) {
      table.increments('id');
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
      table.decimal('available_balance', 19, 2).defaultTo(0.00);
      table.decimal('pending_debit_balance', 19, 2).defaultTo(0.00);
      table.decimal('pending_credit_balance', 19, 2).defaultTo(0.00);
      table.timestamps(true, true, true);
      table.check('?? >= ??', ['available_balance', 0.00]);
      table.check('?? >= ??', ['pending_debit_balance', 0.00]);
      table.check('?? >= ??', ['pending_credit_balance', 0.00]);
    });
}


export async function down(knex: Knex): Promise<void> {
 return knex.schema
    .dropTable('wallets');
}

