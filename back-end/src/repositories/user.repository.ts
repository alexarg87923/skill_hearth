import { logger } from '../utils/logger';
import { User, IUser } from '../models/user.model';
import { Skill } from '../models/skill.model';
import { SkillHas } from '../models/skill_has.model';
import { SkillLookingFor } from '../models/skill_looking_for.model';
import { Types } from 'mongoose';
import { redisClient } from "../config/redis";
import { Relationship } from '../models/relationship.model';
import { RelationshipHistory } from '../models/relationship_history.model';

export class UserRepository {
    async createOrUpdateUUID(
        userId: Types.ObjectId,
        skillList: Array<string | Types.ObjectId>,
        relationshipModel: typeof SkillHas | typeof SkillLookingFor
    ): Promise<Array<Types.ObjectId>> {
        for (let i = 0; i < skillList.length; i++) {
            if (skillList[i] instanceof Types.ObjectId) {
                await relationshipModel.create({
                    user_id: userId,
                    skill_id: skillList[i],
                });
                continue;
            };
            
            const skillName = skillList[i] as string;

            const cachedSkillId = await redisClient.get(`skill:${skillName}`);
            if (cachedSkillId) {
                const skillIdObj = new Types.ObjectId(cachedSkillId);
                skillList[i] = skillIdObj;
        
                await relationshipModel.create({
                    user_id: userId,
                    skill_id: skillIdObj,
                });
                continue;
            };
      
            let skillDoc = await Skill.findOne({ name: skillName });
            if (!skillDoc) {
                skillDoc = await Skill.create({ name: skillName });
            };
      
            const skillId = skillDoc._id;
            skillList[i] = skillId;
      
            await redisClient.set(`skill:${skillName}`, skillId.toString());
      
            await relationshipModel.create({
              user_id: userId,
              skill_id: skillDoc._id
            });
        };
      
        return skillList.map((skill) => {
            if (skill instanceof Types.ObjectId) {
                return skill;
            };
            if (!Types.ObjectId.isValid(skill)) {
                throw new Error(`Invalid skill value: ${skill}`);
            };
            return new Types.ObjectId(skill);
          });
    };

    async addProfile(
        userProfile: Partial<IUser>,
        user_id: string
    ): Promise<IUser | null> {
        const skills = userProfile.skills || [];
        const interests = userProfile.interests || [];
        const userID = new Types.ObjectId(user_id);

        let updatedSkills: Array<Types.ObjectId> = [];
        let updatedInterests: Array<Types.ObjectId> = [];

        if (skills.length > 0) {
            updatedSkills = await this.createOrUpdateUUID(userID, skills, SkillHas);
        };

        if (interests.length > 0) {
            updatedInterests = await this.createOrUpdateUUID(userID, interests, SkillLookingFor);
        };

        userProfile.skills = updatedSkills;
        userProfile.interests = updatedInterests;
        userProfile.onboarded = true;

        const updatedUser = await User.findByIdAndUpdate(
            userID,
            userProfile,
            { new: true }
        );

        logger.info('User updated successfully!');
        return updatedUser;
    };

    async findUserByEmail(email: string): Promise<Partial<IUser> | null> {
        return (await User.findOne({ email: email }));
    };

    async createUser(user: Partial<IUser>): Promise<Partial<IUser> | null> {
        return (await User.create(user));
    };

    async get_batch_of_users(
        user_id: string,
        interests: Types.ObjectId[], 
        skills: Types.ObjectId[],
        users_to_avoid: Array<string> = []
    ): Promise<Array<IUser> | null> {
        const existing_relationships = await Relationship.aggregate([
            {
                $match: {
                    $or: [{ user1_id: new Types.ObjectId(user_id) }, { user2_id: new Types.ObjectId(user_id) }]
                }
            },
            {
                $project: {
                    otherUser: {
                        $cond: { if: { $eq: ["$user1_id", new Types.ObjectId(user_id)] }, then: "$user2_id", else: "$user1_id" }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    uniqueUserIds: { $addToSet: "$otherUser" }
                }
            },
            {
                $project: {
                    _id: 0,
                    uniqueUserIds: 1
                }
            }
        ]);
        return await User.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { _id: { $in: await SkillLookingFor.find({ skill_id: { $in: skills } }).distinct('user_id') } },
                                { _id: { $in: await SkillHas.find({ skill_id: { $in: interests } }).distinct('user_id') } }
                            ]
                        },
                        { _id: { $nin: existing_relationships.length > 0 ? existing_relationships[0].uniqueUserIds : [] } },
                        { _id: { $nin: users_to_avoid.map(uuid => new Types.ObjectId(uuid)) } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    email: 1,
                    bio: 1,
                    location: 1,
                    skills: 1,
                    interests: 1,
                    profile_picture: 1
                }
            },
            {
                $lookup: {
                    from: "skills",
                    localField: "skills",
                    foreignField: "_id",
                    as: "skillObjects"
                }
            },
            {
                $addFields: {
                    skills: { $map: { input: "$skillObjects", as: "skill", in: "$$skill.name" } }
                }
            },
            {
                $project: {
                    skillObjects: 0
                }
            },
            {
                $lookup: {
                    from: "skills",
                    localField: "interests",
                    foreignField: "_id",
                    as: "interestObjects"
                }
            },
            {
                $addFields: {
                    interests: { $map: { input: "$interestObjects", as: "interest", in: "$$interest.name" } }
                }
            },
            {
                $project: {
                    interestObjects: 0
                }
            }
        ]);
    };

    async handleStatusUpdate(user_id: string, match_id: string, status: string) {
        console.log(user_id, match_id);
        let relationship_row = await Relationship.findOne({
            $or: [
                { user1_id: user_id, user2_id: match_id },
                { user1_id: match_id, user2_id: user_id }
            ]
        });

        let previous_status = "created";
        let updated_status = status;

        if (relationship_row) {
            previous_status = relationship_row.status;

            if (relationship_row.status === "pending") {
                updated_status = status === "pending" ? "matched" : status;
            };

            if (relationship_row.status === "pending" || status === "not_interested") {
                await Relationship.updateOne(
                    { _id: relationship_row._id },
                    { $set: { status: updated_status, updated_at: new Date() } }
                );
            };
        } else {
            relationship_row = await Relationship.create({
                user1_id: user_id,
                user2_id: match_id,
                status,
                updated_at: new Date()
            });

            if (!relationship_row) {
                throw new Error("Failed to create relationship record");
            };
        };

        await RelationshipHistory.create({
            relationship_id: relationship_row._id,
            previous_status,
            new_status: updated_status,
            changed_by: user_id,
            changed_at: new Date()
        });
    };

    async verify_user_email(uuid: string): Promise<undefined> {
        return;
    };

    async save_message(formData: {to: Types.ObjectId | string, from: Types.ObjectId | string, message: string, timestamp: string }) : Promise<boolean> {
        return false;
    };
};
