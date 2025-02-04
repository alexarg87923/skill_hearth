import { IProfileData } from '../models/profile.model';
import { User, IUser } from '../models/user.model';
import { UpdateResult } from 'mongoose';

export class UserRepository {
    async findUserByEmail(email: string): Promise<IUser | null> {
        return (await User.findOne({ email: email }).exec());
    };

    async createUser(user: IUser): Promise<IUser> {
        return await User.create(user);
    };

    async addProfile(user_profile: IProfileData, user_id: string): Promise<boolean> {
        return ((await User.updateOne({ _id: user_id }, user_profile)).modifiedCount == 1);
    }

};
