import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IUserDocument } from '../../user/interfaces/userInterface';
import { authService } from '../../../lib/services/db/authService';


export class AuthedUser{

    public async read( req: Request, res: Response ): Promise<void>{
        const token = req.session?.jwt;
        let isAuth = false;
        let user = null;
        const currentUser: IUserDocument = await authService.getUserFromToken(token);

        if( Object.keys( currentUser ).length ){
            isAuth = true;
            user = currentUser;
        }

        res.status(HTTP_STATUS.OK).json( { isAuth, token, user } );
    }


}
