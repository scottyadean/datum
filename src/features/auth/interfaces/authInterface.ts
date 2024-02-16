import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IUserDocument } from '../../user/interfaces/userInterface';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}


export interface IAuthDocPartial {
  uId?: string;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  createdAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
};

export interface AuthPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  isAdmin?: string|boolean;
  admin?: string|boolean;
  iat?: number;
  authId?: string;
}

export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  userId?: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
  roles?: string,
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export interface ISignUpData {
  _id: ObjectId;
  uId: string;
  email: string;
  username: string;
  password: string;
  avatarColor: string;
}



export interface IAuthJob {
  value?: string | IAuthDocument | IUserDocument;
}
