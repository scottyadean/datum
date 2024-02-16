import { CacheService } from '@lib/services/db/cacheService';
import { ServerError } from '@utils/errors';

export class UserFollowCache extends CacheService {

    public keyPrefix:string;

    constructor(){
        super('user-follow-cache');
        this.keyPrefix = 'user-following';
    }

    /**
     * Save user following object to cache.
     * save a list of poeple a user is following.
     * // follower id : string[] <- array of following ids
     * @param uId string cache key // unique id from user table note: not the _id the string val uId
     * @param data strinify user following object
     */
    public async saveUserFollowerCache(uId: string, followingId: string, action='follow') : Promise<void> {
        try {
            const key = `${this.keyPrefix}:${uId}`;
            await this.checkConnection();
            if( action === 'follow' ){
                this.log.info('added follow to cache');
                await this.client.LPUSH(key, `${followingId}`);
            }else{
                this.log.info('removed follow to cache');
                await this.client.LREM(key, 1, `${followingId}` );
            }

        } catch (error) {
            this.log.error(error);
            throw new ServerError('could not save follow cache');
        }
    }

    /**
     * @function getUserFollowingList
     * return a list of people a users follows
     * @param uId user unique id to append to the key prefix
     * @returns string[]
     */
    public async getUserFollowingList(uId: string) : Promise<string[]> {
        let followers: string[] = [];
        try {
            const key = `${this.keyPrefix}:${uId}`;
            await this.checkConnection();
            followers = await this.client.LRANGE(key, 0, -1);
            this.log.info('list of following from cache');
            return followers;
        } catch (error) {
            this.log.error( `could not save user following cache: ${error} ` );
            return followers;
        }
    }

    /**
     *
     * @param uId
     * @param following
     */
    public async saveUserFollowingList(uId:string, following:string[]) : Promise<void> {
        try {
            const key = `${this.keyPrefix}:${uId}`;
            await this.checkConnection();
            await this.client.LPUSH(key, following);
            this.log.info('list of followers saved to cache');
        } catch (error) {
            this.log.error( `could not get following cache: ${error} ` );
        }
    }

}
