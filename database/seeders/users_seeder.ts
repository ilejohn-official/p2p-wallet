import { Knex } from "knex";
import {hashPassword} from "../../src/utils";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {id: 1, name: 'Martin Albert', email: "martin@example.com", password: await hashPassword('123456')},
        {id: 2, name: 'Victoria Smith', email: "victoria@example.com", password: await hashPassword('987654')},
        {id: 3, name: 'John Doe', email: "john@example.com", password: await hashPassword('123456')},
        {id: 4, name: 'Deborah Peters', email: "deborah@example.com", password: await hashPassword('654321')}
    ]);
};
