import Logger from 'bunyan';

import { IPostDocument } from '../../../features/posts/interfaces/postsInterface';
import { PostsModel } from '../../../features/posts/models/postsModel';
import { RedisService } from './redisService';
import { config } from '../../../config';


export class PostService{

    public redisService: RedisService;
    public logger: Logger;
    constructor(){
        this.redisService = new RedisService();
        this.logger = config.initLogger('post-service');
    }

    public async savePost(post:IPostDocument): Promise<void>{
        try{
            await PostsModel.create(post);
        } catch(err){
            this.logger.error(err);
        }
    }

    public async updatePost(id: string, uid: string, data: IPostDocument) : Promise<boolean> {
        try{
            const post = await PostsModel.findOne({_id: `${id}`});
            if ( !post || `${post?.userId}` !== `${uid}` ){
                return false;
            }
            post.update({...data});
            await this.redisService.savePost({ key: id, post: post });
            const res = await PostsModel.updateOne({_id: `${id}`}, { ...data });
            return res.acknowledged;
        }catch(err){
            this.logger.error(err);
        }
        return false;
    }


    public async getPostById(id:string) : Promise<string> {
        try{
            const postjson = await this.redisService.getPost(`post-${id}`);
            if ( postjson! ){
                return postjson;
            }
            const post =  await PostsModel.findById(id);
            if(post) {
                this.redisService.savePost({key: id, post: post});
                return  JSON.stringify(post);
            }
        }catch(err){
            this.logger.error(err);
        }
        return '';
    }
}
