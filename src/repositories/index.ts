import db from "../../database/db.connection";
import { Knex } from "knex";

export class BaseRepository {

    table_name: string;
    queryBuilder: Knex.QueryBuilder

    constructor(table_name: string) {
        this.table_name = table_name;
        this.queryBuilder = db(table_name);
    };

    all(): Knex.QueryBuilder {
      return this.queryBuilder;
    }

    create(data: any, returning: string[] = ['*'], options = undefined): Knex.QueryBuilder {
      return this.queryBuilder.insert(data, returning, options);
    }

}