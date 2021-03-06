import {hashPassword} from "../utils";
import {UserRepository} from "../repositories/user_repository";
import { IUserRepository, User } from "../global/interfaces";

export class UserService {

  private userRepository: IUserRepository;

  constructor(){
    this.userRepository = new UserRepository();
  }

  async create(name:string, email:string, password:string): Promise<User> {
    let hashedPassword = await hashPassword(password);

    const [user] = await this.userRepository.create({
      name, email, password: hashedPassword
    }, ['id', 'name', 'email']);

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.getUserByEmail(email);
  }

  async all(): Promise<User[]> {
    return this.userRepository.all();
  }
}
