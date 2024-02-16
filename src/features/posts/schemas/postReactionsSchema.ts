import mongoose from 'mongoose';

export const postReactionSchema = {
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', index: true },
  type: { type: String, default: '' },
  userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, default: '' },
  userImage: { type: String, default: '' },
  userComment: { type: String, default: ''},
  createdAt: { type: Date, default: Date.now() }
};
