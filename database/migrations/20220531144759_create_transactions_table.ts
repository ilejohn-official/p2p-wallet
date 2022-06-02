import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('transactions', function (table) {
      table.increments('id');
      table.integer('wallet_id').unsigned().notNullable();
      table.foreign('wallet_id').references('id').inTable('wallets').onUpdate('CASCADE').onDelete('CASCADE');
      table.string('type').checkIn(['CREDIT','DEBIT']);
      table.decimal('debit', 19, 2);
      table.decimal('credit', 19, 2);
      table.text('narration', 'longtext');
      table.string('status').checkIn(['SUCCESS', 'FAILED', 'PENDING']);
      table.jsonb('meta').nullable();
      table.timestamps(true, true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('transactions');
}

