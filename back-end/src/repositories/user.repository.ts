import { User, IUser } from "../models/user.model";

export class UserRepository {
  async createUser(user: Partial<IUser>): Promise<IUser> {
    return User.create(user);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async getAllUsers(): Promise<IUser[]> {
    return User.find();
  }
}