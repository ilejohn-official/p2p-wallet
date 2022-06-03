import { User } from "../services/UserService";
import {BaseRepository} from "./index";

export class UserRepository extends BaseRepository {

    static table:string = "users";

    constructor() {
        super(UserRepository.table);
    };

    async getUserByEmail(email: string): Promise<User> {
        const [user] = await this.queryBuilder.where('email', email);
        return user;
    }

};
