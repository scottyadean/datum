import { Request, NextFunction, Response } from 'express';
import JWT from 'jsonwebtoken';
import {config} from '../../config';

import { NoAuthError } from '../utils/errors';
import { AuthPayload } from '../../features/auth/interfaces/authInterface';


class AuthMiddleWare {

    public verifyAuth (req: Request, _res: Response, next: NextFunction) : void {

        console.log('middle ware');
        try{

            if( !req.session?.jwt ){
                throw new NoAuthError( 'no token' );
            }

            const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_SECRET!) as unknown as AuthPayload;
            req.currentUser = payload;
            console.log(payload);
            console.log(req.currentUser);

        }catch(err){
            throw new NoAuthError('token invalid');
        }

        next();

    }


    public checkAuth( req: Request, _res: Response, next: NextFunction  ) : void {

        console.log(req.currentUser);

        if(!req.currentUser){
            throw new NoAuthError('no auth');
        }

        next();

    }


}


export const authMiddleWare: AuthMiddleWare = new AuthMiddleWare();
