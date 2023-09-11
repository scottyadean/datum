import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
//import {joiValidation} from '../../../lib/decorators/authValidation';
import HTTP_STATUS from 'http-status-codes';
import { IPostDocument } from '../interfaces/postsInterface';
import { RedisService } from '../../../lib/services/db/redisService';
import { IAuthDocument } from '../../auth/interfaces/authInterface';
import { SOCKET_SERVER } from '../../../lib/sockets/BaseSockets';
import { postQueue } from '../../../lib/services/queue/postQueue';
import { PostService } from '../../../lib/services/db/postService';

const postService: PostService = new PostService();
const redisService:  RedisService = new  RedisService();

export class PostsController {


    public async create(req: Request, res: Response) : Promise<void> {
        const { post, bgColor, privacy, gifUrl, profilePicture, feelings } = req.body;
        const id : ObjectId = new ObjectId();
        const user = req.currentUser as IAuthDocument;
        const newPost: IPostDocument = {
            _id: id,
            userId: user.userId,
            username: user.username,
            email: user.email,
            profilePicture,
            avatarColor: bgColor,
            post,
            feelings,
            privacy,
            gifUrl,
            commentsCount: 0,
            imgId: '',
            imgVersion: '',
            createdAt: new Date(),
            reactions: {
                like: 0,
                love: 0,
                haha: 0,
                sad: 0,
                wow: 0,
                angry: 0
            }
        } as IPostDocument;

        redisService.savePost({key: id, post: newPost});
        SOCKET_SERVER.emit('new-post', post);
        postQueue.addPostJob({ value: newPost } );
        res.status(HTTP_STATUS.OK).json( { message: 'Post Created Successfully', newPost } );

    }


    public async update(req: Request, res: Response): Promise<void> {
        let success = true;
        const { id,  data  } = req.body;
        const uid = req.currentUser?.userId;
        console.log(uid);
        try{
            success = await postService.updatePost(id, uid!, data);
        }catch(err){
            console.log(err);
            success = false;
        }

        res.status(HTTP_STATUS.OK).json( { success, id, uid, data  } );
    }


    public async read( req: Request, res: Response ): Promise<void> {
        const id = req.params.id;
        try{
            const post:string|null = await postService.getPostById(`${id}`);
            res.status(HTTP_STATUS.OK).json( { post: JSON.parse(post!), error:null, id } );
        }catch(err){
            console.log(err);
            res.status(HTTP_STATUS.BAD_REQUEST).json( { post:null, error:err,  id } );
        }
    }






}
