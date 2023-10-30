import { IAuthJob } from '../../../features/auth/interfaces/authInterface';
import { authWorker } from '../../workers/authWorker';
import { MainQueue } from './mainQueue';

class AuthQueue extends MainQueue {


    public name = 'addAuthUserToDB';

    constructor(){
        super('auth');
        this.processJob(this.name, 5, authWorker.addAuthUserToDb);
    }

    public addAuthUserJob(data: IAuthJob) : void {
        this.addJob(this.name, data);
    }

}


export const authQueue: AuthQueue = new AuthQueue();

