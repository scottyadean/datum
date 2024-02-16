import { model, Model} from 'mongoose';
import { IPostReactionDocument } from '../interfaces/postsInterface';
import { postReactionSchema } from '../schemas/postReactionsSchema';

import { Schema } from 'mongoose';
export const postReactionsSchema: Schema = new Schema(postReactionSchema);

const PostReactionsModel: Model<IPostReactionDocument> = model<IPostReactionDocument>('PostReaction', postReactionsSchema, 'PostReaction');
export { PostReactionsModel };
