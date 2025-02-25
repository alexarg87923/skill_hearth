import { logger } from '../utils/logger';
import { User, IUser } from '../models/user.model';
import { Matches } from '../models/matches.model';
import mongoose, { Types } from 'mongoose';

export class UserRepository {
    async findUserByEmail(email: string): Promise<Partial<IUser> | null> {
        return (await User.findOne({ email: email }));
    };

    async createUser(user: Partial<IUser>): Promise<Partial<IUser> | null> {
        return (await User.create(user));
    };

    async get_batch_of_users(user_id: string, interests: Types.ObjectId[], skills: Types.ObjectId[]): Promise<string[] | null> {
        try {
            const result = await Matches.aggregate([
                {
                    $facet: {
                        interests: [
                            { $match: { _id: { $in: skills } } },
                            { $project: { _id: 0, has_interest: 1 } }
                        ],
                        looking_for: [
                            { $match: { name: { $in: interests } } },
                            { $project: { _id: 0, looking_for: 1 } }
                        ]
                    }
                },
                {
                    $project: {
                      _id: 0,
                      combined_interests: {
                        $concatArrays: ["$interests.has_interest", "$looking_for.looking_for"]
                      }
                    }
                },
                {
                    $unwind: "$combined_interests"
                },
                {
                    $group: {
                      _id: null,
                      interests: { $addToSet: "$combined_interests" }
                    }
                }
            ]);

            return result[0].interests;
        } catch (err) {
            logger.error(`Failed to get new batch of users: ${err}`);
            return null;
        };
    };

    async addProfile(user_profile: Partial<IUser>, user_id: string): Promise<IUser | null> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
      
            const { skills = [], interests = [], _id } = user_profile;
            var skills_ids = [];
            var interests_ids = [];

            if (skills) {
                for (const skill of skills) {
                    var skillDoc = await Matches.findOne({ name: skill }).session(session);
                    if (skillDoc) {
                        skillDoc.has_interest.push(_id);
                        await skillDoc.save({ session });
                    } else {
                        skillDoc = (await Matches.create(
                            [
                                {
                                    name: skill,
                                    has_interest: [_id],
                                    looking_for: []
                                }
                            ],
                            { session }
                        ))[0];
                    };
                    skills_ids.push(skillDoc._id);
                };
            };

            if (interests) {
                for (const interest of interests) {
                    let interestDoc = await Matches.findOne({ name: interest }).session(session);
                    if (interestDoc) {
                        interestDoc.looking_for.push(_id);
                        await interestDoc.save({ session });
                    } else {
                        interestDoc = (await Matches.create(
                            [
                                {
                                    name: interest,
                                    has_interest: [],
                                    looking_for: [_id]
                                }
                            ],
                            { session }
                        ))[0];
                        interests_ids.push(interestDoc._id);
                    };
                };
            };

            user_profile.interests = interests_ids;
            user_profile.skills = skills_ids;

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
        };
    };
};
