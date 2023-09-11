import JWT from 'jsonwebtoken';

import { IAuthDocument } from '../../../features/auth/interfaces/authInterface';
import { AuthModel } from '../../../features/auth/schemes/auth';
import { RedisService } from '../../services/db/redisService';
import { IUserDocument } from '../../../features/user/interfaces/userInterface';
import { userService } from '../../../lib/services/db/userService';
import { AuthPayload } from '../../../features/auth/interfaces/authInterface';
import { config } from '../../../config';



export interface IAuthDocPartial {
    uId?: string;
    username?: string;
    email?: string;
    password?: string;
    avatarColor?: string;
    createdAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: number | string;
};


const redisService: RedisService = new RedisService();

class AuthService{

    public async getUserByUserNameorEmail(username:string, email:string): Promise<IAuthDocument> {
        const query = {
            $or: [{username: username}, {email: email}]
        };
        const user: IAuthDocument  = await AuthModel.findOne(query).exec() as IAuthDocument;
        return user;
    }

    public tokenDecode(token: string): IAuthDocument {
        return JWT.decode(token) as unknown as IAuthDocument;
    }

    public async getAuthUser(key: string, search: string): Promise<IAuthDocument> {
        const query = { [key]: search};
        const user : IAuthDocument = await AuthModel.findOne( query ) as IAuthDocument;
        return user;
    }

    public async createAuthUser( data: IAuthDocument ) :Promise<void> {
        await AuthModel.create(data);
    }

    public async setPasswordToken ( id: string, hash: string, exp: number ) : Promise<void>{
       await AuthModel.updateOne( {_id: id},  {   passwordResetToken: hash,  passwordResetExpires: exp } );
    }

    public async updateAuth( id: string, data: IAuthDocPartial ) : Promise<void> {
        await AuthModel.updateOne( {_id: id},  { ...data } );
    }

    public async getUserByResetToken(hash: string): Promise<IAuthDocument> {
        const query = { passwordResetToken: hash };
        const user : IAuthDocument = await AuthModel.findOne( query ) as IAuthDocument;
        return user;
    }

    public async getUserFromToken( token: string) : Promise<IUserDocument> {
        const payload: AuthPayload = JWT.verify(token, config.JWT_SECRET!) as unknown as AuthPayload;
        const cachedUser: IUserDocument = await redisService.getUserFromCache(`${payload.userId}`) as IUserDocument;
        const currentUser: IUserDocument = (cachedUser) ? cachedUser : await userService.getUserByAuthId(`${payload.authId}`);
        return currentUser;
    }


}


export const authService: AuthService = new AuthService();
