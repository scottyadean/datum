import { CacheService } from '../../db/cacheService';
import { IUserDocument } from '../../../../features/user/interfaces/userInterface';
import { ServerError } from '../../../utils/errors';
import { Helpers } from '../../../utils/helpers';
import { UserModel } from '../../../../features/user/schemes/userSchema';

export class UserCache extends CacheService {

  constructor() {
    super('user-service-cache');
  }

  /**
   * Save a user to Hex Set in Redis Cache Table
   * @param key
   * @param userId
   * @param data
   */
  public async saveUserToCache(key: string, userId: string, data: IUserDocument): Promise<void> {

    try {
        const userData = this.getUserData(data);
        await this.checkConnection();
        await this.client.ZADD('user', { score: parseInt(userId, 10), value: `${key}` });
        await this.client.hSet(`users:${key}`, userData);
    } catch (error) {
        this.log.error(error);
        throw new ServerError('could not save user cache!');
    }
  }

  public async getUserFromCache(key: string): Promise<Partial<IUserDocument>|null>  {
    const output : Partial<IUserDocument> = {};
    try{
        await this.checkConnection();
        const user: IUserDocument = await this.client.HGETALL(`users:${key}`) as unknown as IUserDocument;

        if(!user){
          const usr: IUserDocument = await UserModel.findById({ _id: key }) as IUserDocument;
          if ( usr ){
            await this.saveUserToCache(`${key}`, `${usr.uId}`, usr);
          }
          return usr;
        }

        const parser = {  'blocked': 1,
                          'blockedBy': 1,
                          'notifications': 1,
                          'roles': 1  };
        for (const [k, v] of Object.entries(user)) {
            if (  Helpers.has(parser, k) ) {
                output[k as keyof IUserDocument] = Helpers.parseJson( v );
            }else{
                output[k as keyof IUserDocument] = v;
            }
          }
    }catch(err){
        this.log.error(err);
        throw new ServerError('error retrieving user from cache');
    }

    if( Object.keys( output ).length === 0 ){
      return null;
    }

    return output;
  }

  public getUserData(data: IUserDocument): string[] {
    const createdAt = new Date();
    const { _id,
            uId,
            displayName,
            username,
            email,
            avatarColor,
            blocked,
            blockedBy,
            postsCount,
            profilePicture,
            followersCount,
            followingCount,
            notifications,
            work,
            location,
            roles,
            quote,
            bgImageId,
            bgImageVersion} = data;

    const userData: string[] = [
      '_id', `${_id}`,
      'uId', `${uId}`,
      'displayName', `${displayName}`,
      'username', `${username}`,
      'email', `${email}`,
      'createdAt', `${createdAt}`,
      'postsCount', `${postsCount || 0}`
    ];
    const blockData: string[] = [
        'blocked', JSON.stringify(blocked),
        'blockedBy', JSON.stringify(blockedBy)
    ];

    const imageData: string[] = [
      'profilePic', `${profilePicture}`,
      'avatar', `${avatarColor}`,
      'bgImageId', `${bgImageId}`,
      'bgImageVersion', `${bgImageVersion}`
    ];

    const profileData: string[] = [
      'followersCount', `${followersCount}`,
      'followingCount', `${followingCount}`,
      'notifications', JSON.stringify(notifications),
      'work', `${work}`,
      'location', `${location}`,
      'quote', `${quote}`,
      'roles', JSON.stringify(roles)
    ];

    return [...userData, ...blockData, ...imageData, ...profileData];
  }
}
