import Logger from 'bunyan';
import { CacheService } from '../../../services/db/cacheService';
import { ICommentDocument } from '../../../../features/posts/interfaces/postCommentInterface';
import { ServerError } from '../../../utils/errors';
import { config } from '../../../../config';




export class PostCommentCache extends CacheService {

    public logger: Logger;

    constructor(){
        super();
        this.logger = config.initLogger('post-comment-cache');
    }

    async connect(): Promise<void> {
        try {
          await this.client.connect();
        } catch (error) {
          this.logger.error(error);
        }
      }

      /**
       * Save post comment to cache.
       * @param key string cache key
       * @param data strinify post comment contents
       */
      public async savePostCommentCache(key: string, data: string) : Promise<void> {
        try {
            if ( !this.client.isOpen ){ await this.connect(); }
            await this.client.LPUSH(`post-comment-${key}`, data );
        } catch (error) {
            this.logger.error(error);
            throw new ServerError('could not save post comment cache');
        }
      }



}

