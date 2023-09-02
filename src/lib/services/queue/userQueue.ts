import { IAuthJob } from '../../../features/auth/interfaces/authInterface';
import { userWorker } from '../../workers/userWorker';
import { MainQueue } from './mainQueue';

class UserQueue extends MainQueue {

    public name = 'addUserToDB';

    constructor(){
        super('user');
        this.processJob(this.name, 5, userWorker.addUserToDb);
    }

    public addUserJob(data: IAuthJob) : void {
        this.addJob(this.name, data);

    }
}

export const userQueue: UserQueue = new UserQueue();

