import { logger } from '../utils/logger';
import { User, IUser } from '../models/user.model';
import { Matches } from '../models/matches.model';
import { Types } from 'mongoose';

export class UserRepository {
    async findUserByEmail(email: string): Promise<Partial<IUser> | null> {
        return (await User.findOne({ email: email }));
    };

    async createUser(user: Partial<IUser>): Promise<Partial<IUser> | null> {
        return (await User.create(user));
    };

    async get_batch_of_users(user_id: string, interests: Types.ObjectId[], skills: Types.ObjectId[]): Promise<{user_profiles: Array<Partial<IUser>>} | null | undefined> {
        try {
            const result = await Matches.aggregate([
                // -------------------------------------------------------
                // 1) First do the "facet" and "merge" logic for the user IDs
                // -------------------------------------------------------
                {
                    $facet: {
                    interests: [
                        { $match: { _id: { $in: skills.map(skill => new Types.ObjectId(skill)) } } },
                        { $project: { _id: 0, has_interest: 1 } }
                    ],
                    looking_for: [
                        { $match: { _id: { $in: interests.map(interest => new Types.ObjectId(interest)) } } },
                        { $project: { _id: 0, looking_for: 1 } }
                    ]
                    }
                },
                {
                    $project: {
                    _id: 0,
                    combined_users: {
                        $reduce: {
                        input: { $concatArrays: ["$interests.has_interest", "$looking_for.looking_for"] },
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this"] }
                        }
                    }
                    }
                },
                {
                    $addFields: {
                    combined_users: {
                        $filter: {
                        input: "$combined_users",
                        as: "user_id",
                        cond: { $ne: ["$$user_id", new Types.ObjectId(user_id)] }
                        }
                    }
                    }
                },

                // -------------------------------------------------------
                // 2) Lookup the user profiles in the "users" collection
                // -------------------------------------------------------
                {
                    $lookup: {
                    from: "users",
                    localField: "combined_users",
                    foreignField: "_id",
                    as: "user_profiles"
                    }
                },

                // -------------------------------------------------------
                // 3) Project only the needed fields
                // -------------------------------------------------------
                {
                    $project: {
                    "user_profiles._id": 1,
                    "user_profiles.first_name": 1,
                    "user_profiles.last_name": 1,
                    "user_profiles.skills": 1,
                    "user_profiles.interests": 1,
                    "user_profiles.bio": 1,
                    "user_profiles.location": 1,
                    "user_profiles.profile_picture": 1,
                    "user_profiles.share_email": 1
                    }
                },
                
                // -------------------------------------------------------
                // 4) Unwind each user in user_profiles, so the next $lookup 
                //    can handle their skill / interest arrays individually
                // -------------------------------------------------------
                {
                    $unwind: {
                    path: "$user_profiles",
                    preserveNullAndEmptyArrays: true
                    }
                },
                
                // -------------------------------------------------------
                // 5) For the single user in user_profiles,
                //    lookup skill documents from Matches
                // -------------------------------------------------------
                {
                    $lookup: {
                    from: "matches",
                    let: { skillIds: "$user_profiles.skills" },
                    pipeline: [
                        {
                        $match: {
                            $expr: {
                            $in: ["$_id", "$$skillIds"]
                            }
                        }
                        },
                        { $project: { _id: 0, name: 1 } }
                    ],
                    as: "user_profiles.skills"
                    }
                },
                
                // -------------------------------------------------------
                // 6) Similarly, lookup interest documents from Matches
                // -------------------------------------------------------
                {
                    $lookup: {
                    from: "matches",
                    let: { interestIds: "$user_profiles.interests" },
                    pipeline: [
                        {
                        $match: {
                            $expr: {
                            $in: ["$_id", "$$interestIds"]
                            }
                        }
                        },
                        { $project: { _id: 0, name: 1 } }
                    ],
                    as: "user_profiles.interests"
                    }
                },

                // ------------------------
                // 7) Map skillsInfo and interestsInfo from [{name: "..."}] to ["...", "..."]
                // ------------------------
                {
                    $addFields: {
                    "user_profiles.skills": {
                        $map: {
                        input: "$user_profiles.skills",
                        as: "skillDoc",
                        in: "$$skillDoc.name"
                        }
                    },
                    "user_profiles.interests": {
                        $map: {
                        input: "$user_profiles.interests",
                        as: "interestDoc",
                        in: "$$interestDoc.name"
                        }
                    }
                    }
                },
                
                // -------------------------------------------------------
                // 8) Group them back up so that all user_profiles become an array again
                // -------------------------------------------------------
                {
                    $group: {
                    _id: null,
                    user_profiles: { $push: "$user_profiles" }
                    }
                },
                
                // -------------------------------------------------------
                // 9) Final projection (strip out _id if you want just the data array)
                // -------------------------------------------------------
                {
                    $project: {
                    _id: 0,
                    user_profiles: 1
                    }
                }
            ]);

            return result[0];
        } catch (err) {
            logger.error(`Failed to get new batch of users: ${err}`);
            return null;
        };
    };
    
    async match(user_id: string, match_id: string): Promise<undefined> {
        return;
    }

    async addProfile(user_profile: Partial<IUser>, user_id: string): Promise<IUser | null> {
        try {
            const { skills = [], interests = [] } = user_profile;
            var skills_ids = [];
            var interests_ids = [];

            if (skills) {
                for (const skill of skills) {
                    var skillDoc = await Matches.findOne({ name: skill });
                    if (skillDoc) {
                        skillDoc.has_interest.push(new Types.ObjectId(user_id));
                        await skillDoc.save();
                    } else {
                        skillDoc = (await Matches.create(
                            [
                                {
                                    name: skill,
                                    has_interest: [new Types.ObjectId(user_id)],
                                    looking_for: []
                                }
                            ]
                        ))[0];
                    };
                    skills_ids.push(new Types.ObjectId(skillDoc._id));
                };
            };

            if (interests) {
                for (const interest of interests) {
                    let interestDoc = await Matches.findOne({ name: interest });
                    if (interestDoc) {
                        interestDoc.looking_for.push(new Types.ObjectId(user_id));
                        await interestDoc.save();
                    } else {
                        interestDoc = (await Matches.create(
                            [
                                {
                                    name: interest,
                                    has_interest: [],
                                    looking_for: [new Types.ObjectId(user_id)]
                                }
                            ]
                        ))[0];
                    };
                    interests_ids.push(new Types.ObjectId(interestDoc._id));
                };
            };

            user_profile.interests = interests_ids;
            user_profile.skills = skills_ids;

            const updatedUser = await User.findByIdAndUpdate(
                new Types.ObjectId(user_id),
                { ...user_profile, onboarded: true },
                { new: true }
            );

            logger.info('Transaction committed successfully!');
            return updatedUser;
        } catch (err) {
            logger.error(`Transaction aborted: ${err}`);
            return null;
        };
    };

    async verify_user(uuid: string): Promise<undefined> {
        return;
    };
};
