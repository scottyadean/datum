
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { PostService } from '../services/db/postService';
import { userService } from '../services/db/userService';
import { config } from '../../config';

const log: Logger = config.initLogger('authWorker');
const postService: PostService = new PostService();

class PostWorker {
        async addPostToDb( job: Job, done: DoneCallback  ) : Promise<void>{
            try{
                const { value } = job.data;
                await postService.savePost(value);
                await userService.updatePostCount( value.userId );
                job.progress(100);
                done(null, job.data);
            }catch(err){
                log.error(err);
                done(err as Error);
            }
        }
}

export const postWorker: PostWorker = new PostWorker();
