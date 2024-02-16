
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { userService } from '@lib/services/db/userService';
import {config} from '@conf/config';
const log: Logger = config.initLogger('authWorker');

class UserWorker {

        async addUserToDb( job: Job, done: DoneCallback  ) : Promise<void>{
            try{
                const { value } = job.data;
                await userService.createUser(value);
                job.progress(100);
                done(null, job.data);
            }catch(err){
                log.error(err);
                done(err as Error);
            }
        }

        async addUserFollowerToDb( job: Job, done: DoneCallback ) : Promise<void>{
            try{
                const { value, action } = job.data;
                await userService.userFollow(value, action);
                job.progress(100);
                done(null, job.data);
            }catch(err){
                log.error(err);
                done(err as Error);
            }
        }

        async addUserFollowerToCache( job:Job, done: DoneCallback ) {
            try{
                const { uId, following } = job.data;
                await userService.userFollowCacheList(uId, following);
                job.progress(100);
                done(null, job.data);
            }catch(err){
                log.error(err);
                done(err as Error);
            }
        }

}

export const userWorker: UserWorker = new UserWorker();
