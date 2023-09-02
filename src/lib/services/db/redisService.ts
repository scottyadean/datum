import { CacheService } from './cacheService';
import { IUserDocument } from '../../../features/user/interfaces/userInterface';
import { ServerError } from '../../utils/errors';
import { Helpers } from '../../utils/helpers';
import { forEach } from 'lodash';

export class RedisService extends CacheService {
  constructor() {
    super();
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.log(error);
    }
  }

  public async saveUser(key: string, userId: string, data: IUserDocument): Promise<void> {
    console.log(key, userId, data);

    try {
        const userData = this.getUserData(data);
        if ( !this.client.isOpen ){
            await this.connect();
        }
        await this.client.ZADD('user', { score: parseInt(userId, 10), value: `${key}` });
        await this.client.hSet(`users:${key}`, userData);
    } catch (error) {
        console.log(error);
        throw new ServerError('could not save user cache!');
    }
  }

  public async getUserFromCache(key: string) : Promise<Partial<IUserDocument>|null>  {
    const output : Partial<IUserDocument> = {};
    try{
        if ( !this.client.isOpen ){
            await this.connect();
        }

        // cache is not working
        const user: IUserDocument = await this.client.HGETALL(`users:${key}`) as unknown as IUserDocument;
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

          console.log('output is eq to: ');
          console.log(output);

    }catch(err){
        throw new ServerError('no user cache found');
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
      'username', `${username}`,
      'email', `${email}`,
      'createdAt', `${createdAt}`,
      'postsCount', `${postsCount}`
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

//export const redisService: RedisService = new RedisService();
