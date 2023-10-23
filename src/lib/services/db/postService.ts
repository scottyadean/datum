import Logger from 'bunyan';

import { IPostDocument, IReactionPostRequest, IPostReactionDocument, IReactions, IReactionDocument } from '../../../features/posts/interfaces/postsInterface';
import { PostReactionsModel } from '../../../features/posts/models/postReactionsModel';

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

    public async getPostDoc(id:string) : Promise<IPostDocument|null> {
        try{
            const postjson = await this.redisService.getPost(`post-${id}`);
            if ( postjson! ){
                console.log('yes post was from cache');
                console.log(postjson);
                return JSON.parse(postjson) as IPostDocument;
            }
            const post = await PostsModel.findById(id);
            if(post) {
                this.redisService.savePost({key: id, post: post});
                return  post;
            }
        }catch(err){
            this.logger.error(err);
        }
        return null;
    }

    public async getReactions(id: string) : Promise<Array<IPostDocument>|null>{
        try{
            const reactions = await PostReactionsModel.find( {  postId: id } );
            return reactions;
        }catch(err){
            return null;
        }
    }


    public async setReaction(id:string, data:IReactionPostRequest) : Promise<boolean> {
        const post = await this.getPostDoc(id);
        if( post ){
            const updateReactions: IReactions = post.reactions as IReactions;
            type resKey = keyof typeof updateReactions;
            const idx: resKey = data.typ as resKey;
            (updateReactions[idx] as number) = ( this.updateCount(`${updateReactions[idx]}`) );
            const updateData = {  reactions:  updateReactions   };
            await PostsModel.updateOne( {_id: `${id}`}, { $inc: this.getReactionUpdate(idx) }  );
            post.reactions = updateData.reactions;
            await this.redisService.savePost({ key: id, post: post });
            const reactionData: IPostReactionDocument = {
                postId: post._id,
                type: data.typ,
                userTo: post.userId,
                userFrom: data.userId,
                userName: data.username,
                userImage: data.userImage,
                userComment: data.comment,
                createdAt: new Date()
            } as IPostReactionDocument ;

            await this.saveReaction( reactionData );
            return true;
        }
        return false;
    }




    // _id?: string | ObjectId;
    // userTo?: string | ObjectId;
    // userFrom?: string | ObjectId;
    // type: string;
    // postId: string;
    // userName: string;
    // userImage: string
    // userComment?: string;
    // createdAt?: Date;
    public async saveReaction( data: IPostReactionDocument  ) : Promise<boolean>{

        try{
            const  { postId, type, userFrom  } = data;
            await PostReactionsModel.replaceOne(  {  postId, type, userFrom  }, data, { upsert: true }  );
            return true;

        }catch(err){
            this.logger.error(err);
            return false;
        }


    }


    private updateCount(count:string) : number {
        let cnt =( +count ) as number;
        return ( cnt += 1 ) as number;
    }


    private getReactionUpdate( idx: string ) : object {
        switch ( idx ) {
            case 'happy':
                return { 'reactions.happy' : 1 };
            case 'like':
                return { 'reactions.like' : 1 };
            case 'love':
                return {'reactions.love' : 1 };
            case 'sad':
                return { 'reactions.sad' : 1 };
            case 'wow':
                return { 'reactions.wow' : 1 };
            case 'angry':
                return { 'reactions.angry' : 1 };
            default:
                return { 'reactions.none' : 1 };
        }
    }

}