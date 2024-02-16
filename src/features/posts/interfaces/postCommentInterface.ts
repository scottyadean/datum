import { AuthPayload } from '@features/auth/interfaces/authInterface';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface ICommentDocument extends Document {
  _id?: string|ObjectId;
  username: string;
  userId: string|ObjectId;
  postId: string;
  comment: string;
  createdAt?: Date;
  userTo?: string | ObjectId;
}

export interface ICommentJob {
  value: {
      id: string;
      comment: string;
      user: AuthPayload;
  }
}

export interface ICommentNameList {
  count: number;
  names: string[];
}

export interface IQueryComment {
  _id?: string | ObjectId;
  postId?: string | ObjectId;
}

export interface IQuerySort {
  createdAt?: number;
}
