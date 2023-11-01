
import express, {Router} from 'express';
import { PostsController } from '../controllers/postsController';

class PostRoutes {

    private router: Router;

    private authRouter: Router;

    constructor(){
        this.router = express.Router();
        this.authRouter = express.Router();
    }

    public routes():Router {
        this.router.get('/read/:id', PostsController.prototype.read );
        this.router.get('/reactions/:id', PostsController.prototype.readReactions);
        return this.router;
    }

    public authRoutes():Router {
        this.authRouter.post('/create', PostsController.prototype.create);
        this.authRouter.post('/update', PostsController.prototype.update);
        this.authRouter.post('/recation', PostsController.prototype.recation);
        this.authRouter.post('/comment', PostsController.prototype.comment)
        return this.authRouter;
    }



}

export const postRoutes:PostRoutes = new PostRoutes();
