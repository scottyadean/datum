import Logger from 'bunyan';
import { CacheService } from './cacheService';
import { IUserDocument } from '../../../features/user/interfaces/userInterface';
import { IReactionPostRequest, ISavePostToCache } from '../../../features/posts/interfaces/postsInterface';
import { ServerError } from '../../utils/errors';
import { Helpers } from '../../utils/helpers';
import { config } from '../../../config';

export class RedisService extends CacheService {

  public logger: Logger;

  constructor() {
    super();
    this.logger = config.initLogger('post-service');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async checkConnection(): Promise<void> {

    if ( !this.client.isOpen ){
        await this.connect();
    }

  }

  public async savePost(data: ISavePostToCache) : Promise<void> {
    try {
        const {key, post} = data;
        if ( !this.client.isOpen ){ await this.connect(); }
        await this.client.SET( `post-${key}`, JSON.stringify(post) );
    } catch (error) {
        this.logger.error(error);
        throw new ServerError('could not save post cache');
    }
  }

  // public async savePostReactionToCache(data: IReactionPostRequest): Promise<void>{
  //   try {
  //     await this.checkConnection();

  //     if(data.lst){
  //       //
  //     }

  //     if(data.typ){
  //         await this.client.lPush(`reactions:${data.key}`, JSON.stringify(data.reaction));
  //     }



  //   } catch(error){
  //     this.logger.error(error);
  //     throw new ServerError('could not save reaction to cache');
  //   }
  // }

  public async getPost(key:string) : Promise<string | null>{
    if ( !this.client.isOpen ){ await this.connect(); }
    const data = await this.client.GET(key);
    return data;
  }


  public async saveUser(key: string, userId: string, data: IUserDocument): Promise<void> {

    try {
        const userData = this.getUserData(data);
        await this.checkConnection();
        await this.client.ZADD('user', { score: parseInt(userId, 10), value: `${key}` });
        await this.client.hSet(`users:${key}`, userData);
    } catch (error) {
        this.logger.error(error);
        throw new ServerError('could not save user cache!');
    }
  }

  public async getUserFromCache(key: string) : Promise<Partial<IUserDocument>|null>  {
    const output : Partial<IUserDocument> = {};
    try{
        await this.checkConnection();
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
    }catch(err){
        this.logger.error(err);
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
