//import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { userService } from '@lib/services/db/userService';
//import { IAuthDocument } from '../../auth/interfaces/authInterface';

import { Lang } from '@lib/utils/lang';
import { IUserDocument } from '../interfaces/userInterface';



export class UserController{
    /**
     * return basic profile info
     * @method get
     * @param req
     * @param res
     * @returns json
     */
    public async profile( req: Request, res: Response ): Promise<void> {
        try{
            const profile:IUserDocument|null = await userService.getUserProfile(`${req.currentUser?.userId}`);
            res.status(HTTP_STATUS.OK).json({result: profile, error: null });
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json(Lang.defaultErrorRes(`${err}`));
        }
    }


}
