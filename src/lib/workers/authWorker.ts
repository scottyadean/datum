
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

import { authService } from '../services/db/authService';
import {config} from '../../config/config';
const log: Logger = config.initLogger('authWorker');


class AuthWorker {

        async addAuthUserToDb( job: Job, done: DoneCallback  ) : Promise<void>{

            try{
                const { value } = job.data;
                //console.log(value);
                await authService.createAuthUser(value);
                job.progress(100);
                done(null, job.data);

            }catch(err){
                log.error(err);
                done(err as Error);
            }


        }

}

export const authWorker: AuthWorker = new AuthWorker();
