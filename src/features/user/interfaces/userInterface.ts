import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface UserRolesInterface {
  isAdmin: boolean;
  permissions: string[];
}

export interface UserSocalLinksInterface {
  name: string;
  link: string;
}

export interface UserNotificationsInterface {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}

export interface UserInterface extends Document{
  _id: string|ObjectId;
  authId: string|ObjectId;
  uId: string;
  displayName: string;
  profilePicture: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  passwordResetToken: string;
  passwordResetExpires: number;
  blocked: ObjectId[]|string[];
  blockedBy: ObjectId[]|string[];
  notifications: UserNotificationsInterface;
  social: UserSocalLinksInterface[];
  status: string;
  party: string;
  location: string;
  quote: string;
  bgImageId: string;
  roles: UserRolesInterface;
  createdAt: Date;
}


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
  status: string;
  party: string;
  quote: string;
  location: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  followersCount: number;
  followingCount: number;
  notifications: UserNotificationsInterface;
  social: UserSocalLinksInterface[];
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  createdAt?: Date;
  roles?: UserRolesInterface;
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
  notifications: UserNotificationsInterface;
  social: UserSocalLinksInterface[];
  status: string;
  party: string;
  quote: string;
  location: string;
  bgImageVersion: string;
  bgImageId: string;
}



export interface IResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}


export interface IBasicInfo {
  quote: string;
  status: string;
  party: string;
  location: string;
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
  value?: string | UserSocalLinksInterface;
}

export interface IUserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | UserNotificationsInterface | IUserDocument;
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
  _id: string| number | ObjectId;
  username?: string|number;
  displayName?: string|number;
  uId?: string|number;
  email?: string|number;
  avatarColor?: string|number;
  createdAt?: string|number;
  postsCount?: string|number;
  status?: string|number;
  party?: string|number;
  quote?: string|number;
  location?: string|number;
  blocked?: string|number;
  blockedBy?: string|number;
  followersCount?: string|number;
  followingCount?: string|number;
  notifications?: string|number;
  social?: string|number;
  bgImageId?: string|number;
  profilePicture?: string|number;
  roles?: string|number;
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
    status: '',
    location: '',
    party: '',
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
    social: []
  } as unknown as IUserDocument;
};
