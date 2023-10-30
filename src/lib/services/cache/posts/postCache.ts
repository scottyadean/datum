import Logger from 'bunyan';
import { CacheService } from '../../../services/db/cacheService';
import { ISavePostToCache } from '../../../../features/posts/interfaces/postsInterface';
//import { Helpers } from '../../../utils/helpers';
import { ServerError } from '../../../utils/errors';
import { config } from '../../../../config';


export class PostCache extends CacheService {

  public logger: Logger;

  /**
   * init service.
   */
  constructor() {
    super();
    this.logger = config.initLogger('post-service');
  }

  /**
   * connect to redis service.
   */
  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * check if connection is connected
   */
  async checkConnection(): Promise<void> {
    if ( !this.client.isOpen ){ await this.connect(); }
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
        this.logger.error(error);
        throw new ServerError('could not save post cache');
    }
  }

  /**
   * Get post json string from cache
   * @param key
   * @returns string
   */
  public async getPostFromCache(key:string) : Promise<string | null>{
    if ( !this.client.isOpen ){ await this.connect(); }
    const data = await this.client.GET(key);
    return data;
  }

}
