import mongoose from 'mongoose';
import { IUserDocument } from '../../../features/user/interfaces/userInterface';
import { UserModel } from '../../../features/user/schemes/userSchema';

class UserService{

    public async getUserByUserNameOrEmail(username:string, email:string): Promise<IUserDocument> {
        const query = { $or: [{username: username}, {email: email}] };
        const user: IUserDocument = await UserModel.findOne(query).exec() as IUserDocument;
        return user;
    }


    public async getUserByAuthId( id: string ){

        const users: IUserDocument[] = await UserModel.aggregate(
            [
                {$match:  { authId: new mongoose.Types.ObjectId(id) }},
                {$lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId'}},
                {$unwind: '$authId' },
                {$project:  this.aggregateProject()  }

            ]
        );
        return users[0];
    }

    public async createUser( data: IUserDocument ) :Promise<void> {
        await UserModel.create(data);
    }

    public aggregateProject(){
        return {
            _id: 1,
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
            profilePicture: 1
        };
    }

}


export const userService: UserService = new UserService();
