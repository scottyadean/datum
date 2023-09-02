import { Request , Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';

import { IAuthDocument } from '../interfaces/authInterface';
import { authService } from '../../../lib/services/db/authService';
import { userService } from '../../../lib/services/db/userService';
import { BadRequestError } from '../../../lib/utils/errors';
import {config} from '../../../config';
import { IUserDocument } from '../../user/interfaces/userInterface';
import { authMiddleWare } from '../../../lib/middlewares/authMiddleware';

export class SignIn{

    public async read (req: Request, res: Response) : Promise<void> {


        const {  username, password } = req.body;
        const key : string =  ( username.includes('@') ) ?  'email' : 'username';
        const auth : IAuthDocument = await authService.getAuthUser(key, username );



        if(!auth){
            throw new BadRequestError('Invalid creds');
        }

        const passwordMatch: boolean = await auth.comparePassword(password);

        if (!passwordMatch) {
            throw new BadRequestError('Invalid creds');
        }

        const user: IUserDocument = await userService.getUserByAuthId(`${auth._id}`);

        const sup = {
            authId: auth._id,
            userId: user._id,
            uId: auth.uId,
            email: auth.email,
            username: auth.username,
            acolor: auth.avatarColor
        };

        const jwt = JWT.sign(sup, config.JWT_SECRET! );
        req.session = { jwt: jwt };


        res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', 'authId': `${auth._id}`, user: user, token: jwt });



    }

}
