
import { IPostJobData } from '@features/posts/interfaces/postsInterface';
import { ICommentJob } from '@features/posts/interfaces/postCommentInterface';
import { postWorker } from '../../workers/postWorker';
import { MainQueue } from './mainQueue';

export default class PostQueue extends MainQueue {

    public name = 'addPostToDB';

    constructor( action:string ){
        super( 'post' );

        if( action === 'postcomment' ){
            this.name = 'addPostCommentToDB';
            this.processJob(this.name, 5, postWorker.addPostCommentToDB);
        }

        if( action === 'post'){
            this.processJob(this.name, 5, postWorker.addPostToDb);
        }

    }

    public addPostJob(data: IPostJobData) : void {
        this.addJob(this.name, data);
    }

    public addPostCommentJob(data: ICommentJob) : void {
        this.addJob(this.name, data);
    }


}

export const postQueueInit: PostQueue = new PostQueue('init');

