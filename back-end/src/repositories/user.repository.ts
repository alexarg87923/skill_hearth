import { User, IUser } from '../models/user.model';

export class UserRepository {
    async findUserByEmail(email: string): Promise<Partial<IUser> | null> {
        return (await User.findOne({ email: email }));
    };

    async createUser(user: Partial<IUser>): Promise<Partial<IUser> | null> {
        return (await User.create(user));
    };

    async addProfile(user_profile: Partial<IUser>, user_id: string): Promise<Partial<IUser> | null> {
        return (await User.findByIdAndUpdate(user_id, {...user_profile, onboarded: true}, { new: true }));
    };
};
