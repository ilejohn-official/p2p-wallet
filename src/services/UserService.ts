import db from "../../database/db.connection";
import {hashPassword} from "../utils";

interface User {
    name: string,
    email: string,
    id?: number
}

export class UserService {

    static table:string = "users";

    constructor(){
     
    }

    async create(name:string, email:string, password:string): Promise<User> {
      let hashedPassword = await hashPassword(password);

      const users = await db(UserService.table).insert({
        name, email, password: hashedPassword
      }, ['id', 'name', 'email']);

      return users[0];
    }

    static async getUserByEmail(email: string) {
        return await db(UserService.table).where('email', email).first();
    }

}