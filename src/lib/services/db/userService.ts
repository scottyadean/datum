import Logger from 'bunyan';
import mongoose from 'mongoose';
import { IUserDocument, IUserJoinDocument } from '../../../features/user/interfaces/userInterface';
import { UserModel } from '../../../features/user/schemes/userSchema';
import { config } from '../../../config';
class UserService{

    public logger: Logger;

    constructor(){
        this.logger = config.initLogger('user-service');
    }

    public async getUserByUserNameOrEmail(username:string, email:string): Promise<IUserDocument> {
        const query = { $or: [{username: username}, {email: email}] };
        const user: IUserDocument = await UserModel.findOne(query).exec() as IUserDocument;
        return user;
    }

    /**
     * return a user object with auth data.
     * @param id
     * @returns {IUserDocument}
     */
    public async getUserByAuthId( id: string ){
        const users: IUserDocument[] = await UserModel.aggregate(
            [
                {$match:  { authId: new mongoose.Types.ObjectId(id) }},
                {$lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId'}},
                {$unwind: '$authId' },
                {$project:  this.userJoinFields()  }
            ]
        );
        return users[0];
    }

    /**
     * create a new user
     * @param data
     * @returns void
     */
    public async createUser( data: IUserDocument ) :Promise<void> {
        await UserModel.create(data);
    }

    /**
     * update the number of posts a user has.
     * @param id
     */
    public async updatePostCount( id: string) : Promise<void> {
        console.log( ` ${id} being set to update postsCount ` );
        try{
            await UserModel.updateOne( {authId: `${id}`}, { $inc: { postsCount: 1 } }  );
        }catch(err){
            this.logger.error(err);
        }
    }


    /**
     * return a join aggregate
     * @returns {*}
     */
    public userJoinFields() : IUserJoinDocument{
        return {
            _id: 1,
            displayName: 1,
            username: '$authId.username',
            uId: '$authId.uId',
            email: '$authId.email',
            avatarColor: '$authId.avatarColor',
            createdAt: '$authId.createdAt',
            postsCount: '$authId.postsCount',
            work: 1,
            school: 1,
            quote: 1,
            location: 1,
            blocked: 1,
            blockedBy: 1,
            followersCount: 1,
            followingCount: 1,
            notifications: 1,
            social: 1,
            bgImageId: 1,
            profilePicture: 1,
            roles: 1
        } as IUserJoinDocument;
    }

}


export const userService: UserService = new UserService();
