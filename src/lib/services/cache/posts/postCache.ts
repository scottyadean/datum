
import { CacheService } from '../../../services/db/cacheService';
import { ISavePostToCache } from '../../../../features/posts/interfaces/postsInterface';
import { ServerError } from '../../../utils/errors';


export class PostCache extends CacheService {

  /**
   * init service.
   */
  constructor() {
    super('post-service-cache');
  }

  /**
   * Save post as stringify json to cache
   * @param data ISavePostToCache
   */
  public async savePostCache(data: ISavePostToCache) : Promise<void> {
    try {
        const {key, post} = data;
        await this.checkConnection();
        await this.client.SET( `post-${key}`, JSON.stringify(post) );
    } catch (error) {
        this.log.error(error);
        throw new ServerError('could not save post cache');
    }
  }

  /**
   * Get post json string from cache
   * @param key
   * @returns string
   */
  public async getPostFromCache(key:string) : Promise<string | null>{
    await this.checkConnection();
    return await this.client.GET(key);
  }


}
