import {BaseRepository} from "./index";

export class UserRepository extends BaseRepository {

    static table:string = "users";

    constructor() {
        super(UserRepository.table);
    };

    getUserByEmail(email: string) {
     return  this.queryBuilder.where('email', email).first();
    }

};
