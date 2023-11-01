import { CacheService } from '../../../services/db/cacheService';
//import { ICommentDocument } from '../../../../features/posts/interfaces/postCommentInterface';
import { ServerError } from '../../../utils/errors';
import { PostService } from '../../db/postService';

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

