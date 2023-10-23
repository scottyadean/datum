import { model, Model} from 'mongoose';
import { IPostReactionDocument } from '../interfaces/postsInterface';
import { postReactionsSchema } from '../schemas/postReactionsSchema';

const PostReactionsModel: Model<IPostReactionDocument> = model<IPostReactionDocument>('Reaction', postReactionsSchema, 'Reaction');
export { PostReactionsModel };
