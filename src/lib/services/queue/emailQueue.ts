
import { emailWorker } from '../../workers/emailWorker';
import { IMailSettings } from '../../services/messages/emailSender';
import { MainQueue } from './mainQueue';

class EmailQueue extends MainQueue {

    public name = 'sendEmail';

    constructor(){
        super('email');
        this.processJob(this.name, 5, emailWorker.sendEmail);
    }

    public sendEmail(data: IMailSettings) : void {
        this.addJob(this.name, data);

    }
}

export const emailQueue: EmailQueue = new EmailQueue();

