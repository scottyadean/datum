/* eslint-disable @typescript-eslint/no-explicit-any */
import Logger from 'bunyan';
import mongoose, { ObjectId } from 'mongoose';

import { IUserDocument, IUserJoinDocument } from '@features/user/interfaces/userInterface';
import { UserModel } from '@features/user/models/userModel';
import { config } from '@conf/config';
import { UserCache} from '@cache/users/UserCache';
import { UserFollow } from '@features/user/models/userFollowModel';

import { IUserFollowDocument } from '@features/user/interfaces/userFollowInterface';
import { UserFollowCache } from '@cache/users/UserFollowCache';
import UserQueue from '../queue/userQueue';



export default class UserService{

    public logger: Logger;

    constructor(){
        this.logger = config.initLogger('user-service');
    }

    public async getUserByUserNameOrEmail(username:string, email:string): Promise<IUserDocument> {
        const query = { $or: [{username: username}, {email: email}] };
        const user: IUserDocument = await UserModel.findOne(query).exec() as IUserDocument;
        return user;
    }


    /**
     * @function getUserProfile
     * @param userId
     * @returns {IUserDocument}
     */
    public async getUserProfile( userId:string|ObjectId ): Promise <IUserDocument> {
        const query = { _id: userId };
        const exclude:string[] = ['-passwordResetToken', '-blockedBy', '-blocked', '-blocked', '-roles'];
        const user: IUserDocument = await UserModel.findOne(query).select(exclude) as IUserDocument;
        return user;
    }

    /**
     * return a user object with auth data.
     * @param id
     * @returns {IUserDocument}
     */
    public async getUserByAuthId( id: string ){
        const users: IUserDocument[] = await UserModel.aggregate(
            [
                {$match:  { authId: new mongoose.Types.ObjectId(id) }},
                {$lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId'}},
                {$unwind: '$authId' },
                {$project:  this.userJoinFields()  }
            ]
        );
        return users[0];
    }

    /**
     * Create a new user
     * @param {IUserDocument} data
     * @returns {void}
     */
    public async createUser( data: IUserDocument ) :Promise<void> {
        await UserModel.create(data);
    }

    /**
     *
     * @param data
     * @param action
     */
    public async userFollow( data:IUserFollowDocument, action: string ):Promise<void>{

        const query = {followerId: data.followerId, followingId: data.followingId};
        let num = 1; //increment following count
        if ( action === 'follow' ){
            await UserFollow.updateOne(query, data, {upsert: true});
        }else{
            await UserFollow.deleteOne(query);
            num = -1; // decrement from following count
        }
        await this.incrementFollowerCount(`${data.followerId}`, num, 'following');
        await this.incrementFollowerCount(`${data.followingId}`, num, 'follower');

        const userFollowCache:UserFollowCache = new UserFollowCache();
        await userFollowCache.saveUserFollowerCache(data.followerUid, `${data.followerId}`, action );

    }

    /**
     * list all people following a user
     * @param {string} id
     * @returns {object[]} list of users followers
     */
    public async getUserFollowers( id : string) :Promise<object[]> {
        return await UserFollow
            .find({ followingId:  new mongoose.Types.ObjectId(id) })
            .populate('followinguser', ['uId', 'displayName', 'profilePicture', 'postsCount', 'party',  'followersCount', 'followingCount']);
    }

    /**
     * list all people a user is following
     * @param {string} uId
     * @returns {string[]} return a list of objectIds as string
     */
    public async getUserFollowing( uId: string, id: string ):Promise<string[]> {

        // try to get if from cache first
        const userFollowCache:UserFollowCache = new UserFollowCache();
        const followListFromCache = await userFollowCache.getUserFollowingList(uId);
        //return from cache
        if( followListFromCache && followListFromCache.length > 0 ) {
            //this.logger.info('user following list from cache');
            return followListFromCache;
        }
        //cache miss retrieve from db and store in cache
        const followListFromDB = await UserFollow.find({ followerId:  new mongoose.Types.ObjectId(id) }).select(['followingId']);
        if(followListFromDB){
            const following = followListFromDB.map((f)=>`${f.followingId}`);
            const userQueue:UserQueue = new UserQueue('userfollowcache');
            userQueue.addUserFollowToCacheJob(uId, following);
            this.logger.info('user following list from db');
            return following;
        }

        return [];
    }

    /**
     * Save a list of users followers to cache
     * @param uId
     * @param following
     */
    async userFollowCacheList(uId:string, following:string[]) :Promise<void> {
        const userFollowCache:UserFollowCache = new UserFollowCache();
        await userFollowCache.saveUserFollowingList(uId, following );
    }


    /**
     * @function incrementFollowerCount
     * @description
     * Update the user model for both followers and followees
     * increatment or decrement the followingCount: int or followersCount: int based on the
     * action flag
     * @param string id id of the usr to update
     * @param number num 1 or -1 depending if action is set to follow or unfollow
     * @param string action follow unfollow
     * @returns void
     */
    public async incrementFollowerCount(id:ObjectId|string, num=1, action='follow') :Promise<void> {
        try{

            interface IFollowQuery { _id: string, followingCount?: object,  followersCount?: object  };
            const inc = ( action == 'following' ) ?  { followingCount: num } : { followersCount: num };
            const query :IFollowQuery =  { _id: `${id}` };

            // if we are decrementing the users follower or following count we dont want to do that if the number is
            // already zero otherwise the user will end up with a followingCount: -1 or followerCount: -1 in the db
            if( num <= 0 ) {
                if( ( action == 'following' ) ){
                    query.followingCount = {  $gt : 0  };
                }else{
                    query.followersCount = {  $gt : 0  };
                }
            }

            const user = await UserModel.findOneAndUpdate( query , { $inc: inc }, { new: true}  ) as IUserDocument;

            if( user ){
                const userCache = new UserCache();
                await userCache.saveUserToCache( user.uId, `${user._id}`, user );
            }
        }catch(err){
            this.logger.error(err);
        }
    }


    /**
     * update the number of posts a user has.
     * @param id
     */
    public async updatePostCount( id: string) : Promise<void> {
        console.log( ` ${id} being set to update postsCount ` );
        try{
            await UserModel.updateOne( {authId: `${id}`}, { $inc: { postsCount: 1 } }  );
        }catch(err){
            this.logger.error(err);
        }
    }


    /**
     * return a join aggregate
     * @returns {*}
     */
    public userJoinFields() : IUserJoinDocument{
        return {
            _id: 1,
            displayName: 1,
            username: '$authId.username',
            uId: '$authId.uId',
            email: '$authId.email',
            avatarColor: '$authId.avatarColor',
            createdAt: '$authId.createdAt',
            postsCount: '$authId.postsCount',
            party: 1,
            status: 1,
            quote: 1,
            location: 1,
            blocked: 1,
            blockedBy: 1,
            followersCount: 1,
            followingCount: 1,
            notifications: 1,
            social: 1,
            bgImageId: 1,
            profilePicture: 1,
            roles: 1
        } as IUserJoinDocument;
    }

}


export const userService: UserService = new UserService();
