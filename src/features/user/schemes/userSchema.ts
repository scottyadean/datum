
import mongoose, { Schema } from 'mongoose';

export const userLinksMeta =  new Schema({
    name: { type:String },
    link: { type:String }
});

export const userSchema = {
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true },
  uId: { type: String, require: true },
  displayName: {  type: String, require:true },
  profilePicture: { type: String, default: '' },
  postsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  passwordResetToken: { type: String, default: '' },
  passwordResetExpires: { type: Number },
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: {
    messages: { type: Boolean, default: true },
    reactions: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true }
  },
  social: [userLinksMeta],
  status: { type: String, default: '' },
  party: { type: String, default: '' },
  location: { type: String, default: '' },
  quote: { type: String, default: '' },
  bgImageId: { type: String, default: '' },
  roles: {
    isAdmin: { type: Boolean, default: false },
    permissions: { type: Array, default: [] }
  },

  createdAt: { type: Date, default: new Date() }

};
