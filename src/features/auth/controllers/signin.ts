import { Request , Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';

import { IAuthDocument } from '../interfaces/authInterface';
import { IUserDocument } from '../../user/interfaces/userInterface';

import { authService } from '@lib/services/db/authService';
import { userService } from '@lib/services/db/userService';

import { BadRequestError } from '@lib/utils/errors';
import { config } from '@conf/config';

//import { validate }  from '@validation/baseValidation';
//import { signinValidate }  from '@validation/authValidation';


export class SignIn{

    /**
     * POST: check the user and auth table for a valid user/pass or email/pass combo
     * @param req.body { username, password }
     * @returns json response
     */
    //@validate;
    public async read (req: Request, res: Response) : Promise<void> {

        // get request body
        const {  username, password } = req.body;

        // let the user try to log in with the email or username
        const key : string =  ( username.includes('@') ) ?  'email' : 'username';

        // username not found
        const auth : IAuthDocument = await authService.getAuthUser(key, username );
        if(!auth){
            throw new BadRequestError('Invalid creds');
        }

        // password mismatch
        const passwordMatch: boolean = await auth.comparePassword(password);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid creds');
        }

        //get private auth data.
        const user: IUserDocument = await userService.getUserByAuthId(`${auth._id}`);

        // console.log(user);
        // roles format encypted::visiable
        const roles = user.roles?.permissions.join('|');
        // const encrypted_roles = CryptUtil.encypt( `${roles}`, `${config.CLOUD_SECRET}` );

        // token info
        const sup = {
            userId: user._id,
            uId: user.uId,
            email: auth.email,
            username: auth.username,
            admin: user.roles?.isAdmin,
            roles: `${roles}`
        };

        //set the session jwt token
        const jwt = JWT.sign(sup, config.JWT_SECRET! );
        req.session = { jwt: jwt };

        //success
        res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', 'userId': `${user._id}`, user: user, token: jwt });

    }

}
