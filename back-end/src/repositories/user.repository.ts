import { User, IUser } from "../models/user.model";

export class UserRepository {
    async findUserByEmail(email: string): Promise<IUser | null> {
        return (await User.findOne({ email: email }).exec());
    }

    async createUser(user: IUser): Promise<IUser> {
        return await User.create(user);
    }
};
