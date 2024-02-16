
import express, {Router} from 'express';
import { UserController } from '../controllers/userController';
import { UserFollowController } from '../controllers/userFollowController';
import { authMiddleWare } from '@lib/middlewares/authMiddleware';

class UserRoutes {

    private router: Router;
    private authRouter: Router;

    //init public and private routes
    constructor(){
        this.router = express.Router();
        this.authRouter = express.Router();
    }

    //open routes
    public routes():Router {

        this.router.get('/profile', authMiddleWare.checkAuth, UserController.prototype.profile );
        this.router.post('/follow', authMiddleWare.checkAuth, UserFollowController.prototype.followOrUnfollow );
        this.router.get('/followers/:id', authMiddleWare.checkAuth, UserFollowController.prototype.getFollowersList );
        this.router.get('/following', authMiddleWare.checkAuth, UserFollowController.prototype.getFollowingList );

        return this.router;
    }

    public authRoutes():Router {
        // this.authRouter.post('/session/create', SessionController.prototype.create);
        return this.authRouter;
    }

}

export const userRoutes:UserRoutes = new UserRoutes();
