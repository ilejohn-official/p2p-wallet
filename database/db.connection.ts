import config from '../knexfile';
import envVariables from "../src/config";
import knex from 'knex';

const {appEnv} = envVariables;

//initialize knex
export default knex(config[appEnv]);
