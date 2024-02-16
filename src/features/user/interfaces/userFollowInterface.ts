
import { ObjectId, Document } from 'mongodb';

/**
 * base struc for user followers data object
 */
export interface IUserFollowDocument extends Document {
    _id?: ObjectId|string; // mongodb id
    followingId: ObjectId|string; // user being followed
    followingUId: string; // unique id used for cache key
    followerId: ObjectId|string; // user of the follower id
    createdAt?: Date|string; // created date
}

/**
 * used to pass a user following document to queue
 */
export interface IUserFollowJob{
    value: IUserFollowDocument;
    action: string;
}


