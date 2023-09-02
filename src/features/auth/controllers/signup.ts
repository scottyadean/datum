import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { IAuthDocument, ISignUpData } from '../interfaces/authInterface';
import { authService } from '../../../lib/services/db/authService';
import { BadRequestError } from '../../../lib/utils/errors';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';

// import { authValidation } from '../../../lib/decorators/authValidation';
// import { signupSchema } from '../schemes/signup';


import {omit} from 'lodash';

import { IUserDocument, initialUserdata } from '../../user/interfaces/userInterface';
import { RedisService } from '../../../lib/services/db/redisService';
import { authQueue } from '../../../lib/services/queue/authQueue';
import { userQueue } from '../../../lib/services/queue/userQueue';
import { config } from '../../../config';

const redisService: RedisService = new RedisService();


export class SignUp{

    //@authValidation(signupSchema)
    public async create(req:Request, res: Response): Promise<void> {

        const { username, email, password, avatarColor } = req.body;
        const checkIfUserExists:IAuthDocument = await authService.getUserByUserNameorEmail(username, email);
        if(checkIfUserExists){ throw new BadRequestError('Invalid creds'); }

        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId = `${new Date().getTime()}`;
        const authData:IAuthDocument = SignUp.signUpData(  { _id: authObjectId, uId, username, email, password, avatarColor }  );

        console.log(authData);

        // Store User profile in Cache
        const cacheData: IUserDocument = initialUserdata(`${authObjectId}`, uId, username, email, avatarColor);
        redisService.saveUser(`${authObjectId}`, uId, cacheData);

        // Add to Database
        authQueue.addAuthUserJob({ value: authData });

        omit( cacheData, [ 'uId', 'username', 'email', 'avatarColor', 'password' ] );
        userQueue.addUserJob( {value: cacheData} );




        const jwt : string = SignUp.getToken(authData, userObjectId);
        req.session = { jwt: jwt };

        res.status(HTTP_STATUS.CREATED).json( { result: authData,  message: 'user created successfully' } );


    }


    public static getToken(data: IAuthDocument, userObjectId: ObjectId) : string {

        const sup = {
            userId: userObjectId,
            uId: data.uId,
            email: data.email,
            username: data.username,
            acolor: data.avatarColor
        };

        return JWT.sign(sup, config.JWT_SECRET! );

    }

    public static signUpData(data: ISignUpData): IAuthDocument {

        // username: { type: String },
        // uId: { type: String },
        // email: { type: String },
        // password: { type: String },
        // avatarColor: { type: String, default:'#ffffff' },
        // createdAt: { type: Date, default: Date.now },
        // passwordResetToken: { type: String, default: '' },
        // passwordResetExpires: { type: Number, default: -1 }


        const {  _id, username, email, uId, password, avatarColor  } = data;
        return { _id,
                 uId,
                 username,
                 email,
                 password,
                 avatarColor,
                 createdAt: new Date()
            } as IAuthDocument;

    }


}
