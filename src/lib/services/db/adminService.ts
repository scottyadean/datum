import Logger from 'bunyan';
import { IUserDocument, IUserRoles } from '../../../features/user/interfaces/userInterface';
import { UserModel } from '../../../features/user/schemes/userSchema';
import { config } from '../../../config';

class AdminService{

    public logger: Logger;

    constructor(){
        this.logger = config.initLogger('user-service');
    }

    public async index(): Promise<Array<IUserDocument>|null> {
        const query = { 'roles.isAdmin' : true };
        const user: Array<IUserDocument> = await UserModel.find(query) as Array<IUserDocument>;
        return user;
    }

    public async updateUserRoles(id:string, roles:IUserRoles): Promise<boolean> {
        await UserModel.updateOne({_id: id} , { roles: roles});
        
        return true;
    }



}

export const adminService: AdminService = new AdminService();
