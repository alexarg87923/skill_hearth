import { logger } from '../utils/logger';
import { User, IUser } from '../models/user.model';
import { Matches } from '../models/matches.model';
import mongoose from 'mongoose';

export class UserRepository {
    async findUserByEmail(email: string): Promise<Partial<IUser> | null> {
        return (await User.findOne({ email: email }));
    };

    async createUser(user: Partial<IUser>): Promise<Partial<IUser> | null> {
        return (await User.create(user));
    };

    async addProfile(user_profile: Partial<IUser>, user_id: string): Promise<IUser | null> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
      
            const { skills = [], interests = [], _id } = user_profile;
            if (skills) {
                for (const skill of skills) {
                    let skillDoc = await Matches.findOne({ name: skill }).session(session);
                    if (skillDoc) {
                        skillDoc.has_interest.push(_id);
                        await skillDoc.save({ session });
                    } else {
                        await Matches.create(
                            [
                                {
                                    name: skill,
                                    has_interest: [_id],
                                    looking_for: []
                                }
                            ],
                            { session }
                        );
                    };
                };
            };

            if (interests) {
                for (const interest of interests) {
                    let interestDoc = await Matches.findOne({ name: interest }).session(session);
                    if (interestDoc) {
                        interestDoc.looking_for.push(_id);
                        await interestDoc.save({ session });
                    } else {
                    await Matches.create(
                        [
                            {
                                name: interest,
                                has_interest: [],
                                looking_for: [_id]
                            }
                        ],
                        { session }
                    );
                    };
                };
            };
        
            const updatedUser = await User.findByIdAndUpdate(
                user_id,
                { ...user_profile, onboarded: true },
                { new: true, session }
            );
        
            await session.commitTransaction();
            logger.info('Transaction committed successfully!');
            return updatedUser;
        } catch (err) {
            await session.abortTransaction();
            logger.error(`Transaction aborted: ${err}`);
            return null;
        } finally {
            session.endSession();
        }
    };
};
