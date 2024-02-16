import { model, Schema, Model } from 'mongoose';
import { userSchema } from '../schemes/userSchema';
import { IUserDocument } from '../interfaces/userInterface';

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', new Schema(userSchema), 'User');
export { UserModel };
