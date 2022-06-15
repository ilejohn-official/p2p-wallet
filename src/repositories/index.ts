import db from "../../database/db.connection";
import { Knex } from "knex";
import { IBaseRepository } from "../global/interfaces";

export class BaseRepository implements IBaseRepository {

    queryBuilder: Knex.QueryBuilder

    constructor(private table_name: string) {
        this.queryBuilder = db(this.table_name);
    };

    all(): Knex.QueryBuilder {
      return this.queryBuilder;
    }

    create(data: any, returning: string[] = ['*'], options:any = undefined): Knex.QueryBuilder {
      return this.queryBuilder.insert(data, returning, options);
    }

}
