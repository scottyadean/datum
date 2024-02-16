//import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Lang } from '@lib/utils/lang';
import UserQueue from '@lib/services/queue/userQueue';
import { IUserFollowJob } from '../interfaces/userFollowInterface';
import  UserService  from '@lib/services/db/userService';
import { AuthPayload } from '@features/auth/interfaces/authInterface';


export class UserFollowController{
    /**
     * add following object to User Following Model and cache
     * update the userModel and modify the followers: followingCount
     * update the userModel and modily the following: followersCount
     * @method POST
     * @param req
     * @param res
     * @returns json
     */
    public async followOrUnfollow( req: Request, res: Response ): Promise<void> {
        try{
            const params = req.body;
            const user = req.currentUser;
            const action = ( params.action === undefined || params.action === 'follow' ) ? 'follow' : 'unfollow';
            const data: IUserFollowJob = {
                value: {
                    followerId: user.userId,
                    followerUid: user.uId,
                    followingId: params.id,
                    followingUId: params.uid,
                },
                action: action
            };
            const userQueue = new UserQueue('userfollow');
            userQueue.addUserFollowJob(data);
            res.status(HTTP_STATUS.OK).json({result: { action: action, success: true, queue: true }, error: null });
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json(Lang.defaultErrorRes(`${err}`));
        }
    }

    /**
     * return a list of ids
     * @param req
     * @param res
     */
    async getFollowersList( req:Request, res:Response ){

        try{
            const { id } = req.params;
            const userService = new UserService();
            const followers = await userService.getUserFollowers(`${id}`);
            res.status(HTTP_STATUS.OK).json({result: { followers  }, error: null });
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json(Lang.defaultErrorRes(`${err}`));
        }
    }


    /**
     * @description List all people a person is following
     * @returns string[]
     */
    async getFollowingList( req:Request, res:Response ){

        try{
            const user:AuthPayload = req.currentUser;
            const { uId, userId } = user;
            console.log(user);
            const userService = new UserService();
            console.log(  `uId: ${uId}` );
            const following = await userService.getUserFollowing(`${uId}`, `${userId}`);
            res.status(HTTP_STATUS.OK).json({result: { following  }, error: null });
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json(Lang.defaultErrorRes(`${err}`));
        }
    }



}
