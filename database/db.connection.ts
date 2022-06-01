import config from '../knexfile';
import envVariables from "../src/config";
import knex from 'knex';
import {types} from "pg";

types.setTypeParser(types.builtins.NUMERIC, Number);

types.setTypeParser(types.builtins.INT8, (value: string) => {
    return parseInt(value);
});

types.setTypeParser(types.builtins.FLOAT8, (value: string) => {
    return parseFloat(value);
});

const {appEnv} = envVariables;

//initialize knex
export default knex(config[appEnv]);
