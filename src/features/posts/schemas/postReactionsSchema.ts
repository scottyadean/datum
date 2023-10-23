import mongoose, { Schema } from 'mongoose';
export const postReactionsSchema: Schema = new Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts', index: true },
  type: { type: String, default: '' },
  userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, default: '' },
  userImage: { type: String, default: '' },
  userComment: { type: String, default: ''},
  createdAt: { type: Date, default: Date.now() }
});
