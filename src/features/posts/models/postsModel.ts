import { Schema, model, Model} from 'mongoose';
import { IPostDocument } from '../interfaces/postsInterface';
import { postSchema } from '../schemas/postsSchema';

export const postsSchema: Schema = new Schema(postSchema);
const PostsModel: Model<IPostDocument> = model<IPostDocument>('Post', postsSchema, 'Post');
export {PostsModel};
