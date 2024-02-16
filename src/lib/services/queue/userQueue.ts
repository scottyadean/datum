import { IAuthJob } from '@features/auth/interfaces/authInterface';
import { IUserFollowJob } from '@features/user/interfaces/userFollowInterface';
import { userWorker } from '@lib/workers/userWorker';
import { MainQueue } from './mainQueue';

export default class UserQueue extends MainQueue {
    // default
    public name = 'addUserToDB';
    constructor(action:string){

        super('user');

        //save user to cache
        if( action === 'user'){
            this.processJob(this.name, 5, userWorker.addUserToDb);
        }

        //save a single follow action to db and cache
        if ( action === 'userfollow' ){
            this.name = 'addUserFollowerToDb';
            this.processJob(this.name, 5, userWorker.addUserFollowerToDb);
        }

        //save an entire list to cache
        if( action === 'userfollowcache' ){
            this.name = 'addUserFollowerToCache';
            this.processJob(this.name, 5, userWorker.addUserFollowerToCache);
        }
    }

    public addUserJob(data: IAuthJob) : void {
        this.addJob(this.name, data);
    }

    public addUserFollowJob(data: IUserFollowJob) : void {
        this.addJob(this.name, data);
    }

    public addUserFollowToCacheJob( uId:string, following: string[]) : void {
        this.addJob(this.name, { uId , following });
    }

}

// this will add a log in the queue dashboard
export const userQueueInit: UserQueue = new UserQueue('init');

