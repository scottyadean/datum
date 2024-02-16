import { CacheService } from '@lib/services/db/cacheService';
import { PostService } from '@lib/services/db/postService';
import { ServerError } from '@utils/errors';

export class PostCommentCache extends CacheService {

    public postService: PostService;

    constructor(){
        super('post-comment-cache');
        this.postService = new PostService();
    }

      /**
       * Save post comment to cache.
       * @param postId string cache key
       * @param data strinify post comment contents
       */
      public async savePostCommentCache(postId: string, data: string) : Promise<void> {
        try {
            await this.checkConnection();
            await this.client.LPUSH(`post-comment-${postId}`, data);
            await this.postService.incrementCommentCount(`${postId}`);
        } catch (error) {
            this.log.error(error);
            throw new ServerError('could not save post comment cache');
        }
      }
}

