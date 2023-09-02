
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

import { userService } from '../services/db/userService';
import {config} from '../../config';
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

}

export const userWorker: UserWorker = new UserWorker();
