import { model, Model, Schema } from 'mongoose';
import { userFollowSchema } from '../schemes/userFollowSchema';
import { IUserFollowDocument } from '../interfaces/userFollowInterface';

// create the schema
const UserFSchema:Schema = new Schema(userFollowSchema);

/**
 * returns all follower data as nested object
 * this is a join between this document and the user model on follower id
 * example:  UserFollow.find({followingId: id}).populate('followinguser');
*/
UserFSchema.virtual('followinguser',{
    ref: 'User',
    localField: 'followerId',
    foreignField: '_id',
    //justOne: true
});

// tell mongoose to retreive the virtual fields on .populate()
UserFSchema.set('toObject', { virtuals: true });
UserFSchema.set('toJSON', { virtuals: true });

// create the model
const UserFollow: Model<IUserFollowDocument> = model<IUserFollowDocument>('UserFollow', UserFSchema, 'UserFollow');

export {UserFollow};
