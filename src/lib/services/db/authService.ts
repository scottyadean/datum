import { IAuthDocument } from '../../../features/auth/interfaces/authInterface';
import { AuthModel } from '../../../features/auth/schemes/auth';

class AuthService{
    public async getUserByUserNameorEmail(username:string, email:string): Promise<IAuthDocument> {
        const query = {
            $or: [{username: username}, {email: email}]
        };

        const user: IAuthDocument  = await AuthModel.findOne(query).exec() as IAuthDocument;
        return user;
    }


    public async getAuthUser(key: string, search: string): Promise<IAuthDocument> {
        const query = { [key]: search};
        const user : IAuthDocument = await AuthModel.findOne( query ) as IAuthDocument;
        return user;
    }

    public async createAuthUser( data: IAuthDocument ) :Promise<void> {
        await AuthModel.create(data);
    }


}


export const authService: AuthService = new AuthService();
