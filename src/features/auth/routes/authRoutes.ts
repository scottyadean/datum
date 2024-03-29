
import express, {Router} from 'express';
import { SignUp } from '../controllers/signup';
import { SignIn } from '../controllers/signin';
import { SignOut } from '../controllers/signout';
import {AuthedUser} from '../controllers/authedUser';
import { authMiddleWare } from '../../../lib/middlewares/authMiddleware';
class AuthRoutes {

    private router: Router;

    constructor(){
        this.router = express.Router();
    }

    public routes():Router{
        this.router.post('/signup', SignUp.prototype.create );
        this.router.post('/signin', SignIn.prototype.read );
        return this.router;
    }


    public authedRoute(): Router {
        this.router.get('/authed', AuthedUser.prototype.read);
        return this.router;
    }

    public signoutRoute(): Router {
        this.router.get('/signout', SignOut.prototype.signout);
        return this.router;
    }


}


export const authRoutes:AuthRoutes = new AuthRoutes();
