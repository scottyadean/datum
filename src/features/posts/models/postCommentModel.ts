import { model, Model, Schema } from 'mongoose';
import { ICommentDocument } from '../interfaces/postCommentInterface';
import { postCommentSchema } from '../schemas/postCommentSchema';
const postcCommentsSchema: Schema = new Schema(postCommentSchema);
const PostCommentsModel: Model<ICommentDocument> = model<ICommentDocument>('PostComment', postcCommentsSchema, 'PostComment');
export { PostCommentsModel };
