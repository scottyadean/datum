import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { RedisService } from '../../../lib/services/db/redisService';
import { IUserDocument } from '../../user/interfaces/userInterface';
import { userService } from '../../../lib/services/db/userService';
import { AuthPayload } from '../../../features/auth/interfaces/authInterface';
import { config } from '../../../config';

import JWT from 'jsonwebtoken';


const redisService: RedisService = new RedisService();

export class AuthedUser{

    public async read( req: Request, res: Response ): Promise<void>{

        let isAuth = false;
        let token = null;
        let user = null;

        const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_SECRET!) as unknown as AuthPayload;
        const cachedUser: IUserDocument = await redisService.getUserFromCache(`${payload.userId}`) as IUserDocument;
        const currentUser: IUserDocument = (cachedUser) ? cachedUser : await userService.getUserByAuthId(`${payload.authId}`);
        if( Object.keys( currentUser ).length ){
            isAuth = true;
            token = req.session?.jwt;
            user = currentUser;
        }

        res.status(HTTP_STATUS.OK).json( { isAuth, token, user } );
    }


}
