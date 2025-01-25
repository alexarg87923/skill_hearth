import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(user: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.userRepository.findUserByEmail(user.email!);
    if (existingUser) throw new Error("Email already in use");

    return this.userRepository.createUser(user);
  }

  async listUsers(): Promise<IUser[]> {
    return this.userRepository.getAllUsers();
  }
}