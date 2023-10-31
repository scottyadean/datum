import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IUserDocument extends Document {
  _id: string | ObjectId;
  authId: string | ObjectId;
  uId?: string;
  username?: string;
  displayName?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  followersCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  createdAt?: Date;
  roles?: IUserRoles;
}

export interface IUserPublicData extends Document {
  _id: string | ObjectId;
  authId: string | ObjectId;
  uId?: string;
  profilePicture: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  notifications: INotificationSettings;
  social: ISocialLinks;
  work: string;
  school: string;
  quote: string;
  location: string;
  bgImageVersion: string;
  bgImageId: string;
}

export interface IUserRoles {
  isAdmin: boolean;
  permissions: string[];
}

export interface IResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}

export interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}

export interface IBasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}

export interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface ISearchUser {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
  avatarColor: string;
}

export interface ISocketData {
  blockedUser: string;
  blockedBy: string;
}

export interface ILogin {
  userId: string;
}

export interface IUserJobInfo {
  key?: string;
  value?: string | ISocialLinks;
}

export interface IUserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | INotificationSettings | IUserDocument;
}

export interface IEmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}

export interface IAllUsers {
  users: IUserDocument[];
  totalUsers: number;
}

export interface IUserJoinDocument {
  _id: string | number | ObjectId;
  username: string;
  displayName: number;
  uId: string;
  email: string;
  avatarColor: string;
  createdAt: string;
  postsCount: string;
  work: number;
  school: number;
  quote: number;
  location: number;
  blocked: number;
  blockedBy: number;
  followersCount: number;
  followingCount: number;
  notifications: number;
  social: number;
  bgImageId: number;
  profilePicture: number;
  roles?: number;
}

export const initialUserdata = (id: string, uId: string, username: string, displayName: string, email: string, avatarColor: string) => {
  return {
    _id: id,
    authId: id,
    uId,
    displayName,
    username,
    email,
    avatarColor,
    profilePicture: '',
    blocked: [],
    blockedBy: [],
    work: '',
    location: '',
    school: '',
    quote: '',
    bgImageVersion: '',
    bgImageId: '',
    followersCount: 0,
    followingCount: 0,
    postCount: 0,
    notifications: {
      messages: true,
      reactions: true,
      comments: true,
      follows: true
    },
    roles: {
      isAdmin: false,
      permissions: []
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  } as unknown as IUserDocument;
};
