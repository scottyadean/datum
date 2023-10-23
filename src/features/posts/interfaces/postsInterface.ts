import { ObjectId } from 'mongodb';
import mongoose, { Document } from 'mongoose';

export interface IPostDocument extends Document {
  _id?: string | mongoose.Types.ObjectId;
  userId?: string;
  username?: string;
  email?: string;
  avatarColor?: string;
  profilePicture?: string;
  post?: string;
  bgColor?: string;
  commentsCount?: number;
  imgVersion?: string;
  imgId?: string;
  feelings?: string;
  gifUrl?: string;
  privacy?: string;
  reactions?: IReactions;
  createdAt?: Date;
}

export interface IGetPostsQuery {
  _id?: ObjectId | string;
  username?: string;
  imgId?: string;
  gifUrl?: string;
}

export interface ISavePostToCache {
  key: ObjectId | string;
  id?: string;
  uId?: string;
  post: IPostDocument;
}

export interface IPostJobData {
  key?: string;
  value?: IPostDocument;
  keyOne?: string;
  keyTwo?: string;
}

export interface IQueryComplete {
  ok?: number;
  n?: number;
}

export interface IQueryDeleted {
  deletedCount?: number;
}


export interface IReactions {
  like: number;
  love: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
}

export interface IReactionDocument extends Document {
  _id?: string | ObjectId;
  username: string;
  avataColor?: string;
  type: string;
  postId: string;
  profilePicture: string;
  createdAt?: Date;
  userTo?: string | ObjectId;
  comment?: string;
}

export interface IReactionJob {
postId: string;
username: string;
previousReaction: string;
userTo?: string;
userFrom?: string;
type?: string;
reactionObject?: IReactionDocument;
}


export interface IReactionPostRequest {
    key: string;
    typ: string;
    lst: string;
    username: string;
    userId: string| ObjectId;
    userImage: string;
    fromId: string| ObjectId;
    comment: string;
    data?: IReactions
}


export interface IPostReactionDocument extends Document {
  _id?: string | ObjectId;
  postId: string;
  type: string;
  userTo?: string | ObjectId;
  userFrom?: string | ObjectId;
  userName: string;
  userImage: string
  userComment?: string;
  createdAt?: Date;
}


export interface IPostReactionJob {
  postId: string;
  username: string;
  previousReaction: string;
  userTo?: string;
  userFrom?: string;
  type?: string;
  reactionObject?: IReactionDocument;
}

export interface IPostQueryReaction {
  _id?: string | ObjectId;
  postId?: string | ObjectId;
}

export interface IPostReaction {
  senderName: string;
  type: string;
}
