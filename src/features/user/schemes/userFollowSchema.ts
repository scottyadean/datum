
import mongoose from 'mongoose';

export const userFollowSchema = {
  followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // user being followed
  followingUId: { type: String }, // unique id used for cache
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // follower user id
  createdAt: { type: Date, default: new Date() }
};
