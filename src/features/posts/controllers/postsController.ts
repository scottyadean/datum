import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
//import {joiValidation} from '../../../lib/decorators/authValidation';
import HTTP_STATUS from 'http-status-codes';
import { IPostDocument, IReactionPostRequest } from '../interfaces/postsInterface';
import { PostCache } from '../../../lib/services/cache/posts/postCache';
import { IAuthDocument } from '../../auth/interfaces/authInterface';
import { SOCKET_SERVER } from '../../../lib/sockets/BaseSockets';
import { postQueue } from '../../../lib/services/queue/postQueue';
import { PostService } from '../../../lib/services/db/postService';
import { Lang } from '../../../lib/utils/lang';

const postService: PostService = new PostService();
const postCache: PostCache = new PostCache();

export class PostsController {

    /**
     * Create a post
     * @method post
     * @param req
     * @param res
     */
    public async create(req: Request, res: Response) : Promise<void> {
        try{
            const { post, bgColor, privacy, gifUrl, profilePicture, feelings } = req.body.data;
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

            //save post cache
            postCache.savePostCache({key: id, post: newPost});
            //emit socket message
            SOCKET_SERVER.emit('new-post', post);

            //save the post to the db. thru the queue
            postQueue.addPostJob({ value: newPost } );

            //return success
            res.status(HTTP_STATUS.OK).json( { result: Lang.createOk('Post'), newPost } );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
        }
    }

    /**
     * Update a post
     * @method post
     * @param req
     * @param res
     */
    public async update(req: Request, res: Response): Promise<void> {
        try{
            const { id,  data  } = req.body;
            const uid = req.currentUser?.userId;
            const result = await postService.updatePost(id, uid!, data);
            res.status(HTTP_STATUS.OK).json( { result, id, uid, data, error:null  } );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
        }
    }

    /**
     * Return a post by id
     * @method get
     * @param req
     * @param res
     */
    public async read( req: Request, res: Response ): Promise<void> {
        try{
            const id = req.params.id;
            const post:string|null = await postService.getPostById(`${id}`);
            res.status(HTTP_STATUS.OK).json( { result: JSON.parse(post!), error:null, id } );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
        }
    }

    /**
     * Set a post reaction like|love|dislike|happy
     * @method post
     * @param req
     * @param res
     */
    public async recation(req: Request, res: Response): Promise<void> {
        try{
            const { id,  data  } = req.body;
            const user = req.currentUser;
            const update: IReactionPostRequest = {
                        key: `reaction-${id}`,
                        typ: `${data.type}`,
                        lst: `${data.last}`,
                        username: `${user?.username}`,
                        userId: `${user?.userId}`,
                        userImage: '',
                        fromId: `${user?.userId}`,
                        type: `${data.type}`,
                        createdAt: new Date(),
                        comment: `${data.comment}`

            } as IReactionPostRequest;

            await postService.setReaction(id, update);
            res.status(HTTP_STATUS.OK).json( Lang.defaultSuccessRes({ message: Lang.createOk('Post Reaction'), update }) );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
        }
    }

    /**
     * return post reactions
     * @method get
     * @param req
     * @param res
     */
    public async readReactions(req: Request, res: Response) : Promise<void> {
        try{
            const id = req.params.id;
            const reactions = await postService.getReactions(id);
            res.status(HTTP_STATUS.OK).json( Lang.defaultSuccessRes(reactions) );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
        }

    }

}
