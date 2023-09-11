
import { IPostJobData } from '../../../features/posts/interfaces/postsInterface';
import { postWorker } from '../../workers/postWorker';
import { MainQueue } from './mainQueue';

class PostQueue extends MainQueue {

    public name = 'addPostToDB';

    constructor(){
        super('post');
        this.processJob(this.name, 5, postWorker.addPostToDb);
    }

    public addPostJob(data: IPostJobData) : void {
        this.addJob(this.name, data);

    }
}

export const postQueue: PostQueue = new PostQueue();

