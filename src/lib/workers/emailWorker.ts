
import Logger from 'bunyan';
import { DoneCallback, Job } from 'bull';

import { EmailSender } from '../services/messages/emailSender';
import {config} from '../../config';

const log: Logger = config.initLogger('emailWorker');

class EmailWorker {

    public async sendEmail( job: Job, done: DoneCallback  ) : Promise<void>{

        try{
            const { to, subject, html } = job.data;
            const emailer = new EmailSender();
            await emailer.sendEmail(to, subject, html);
            job.progress(100);
            done(null, job.data);

        }catch(err){
            log.error(err);
            done(err as Error);
        }

    }
}


export const emailWorker: EmailWorker = new EmailWorker();
