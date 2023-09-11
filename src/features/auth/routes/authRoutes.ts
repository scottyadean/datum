
import express, {Router} from 'express';
import { SignUp } from '../controllers/signup';
import { SignIn } from '../controllers/signin';
import { SignOut } from '../controllers/signout';
import { AuthedUser } from '../controllers/authedUser';
import { AuthedPasswords } from '../controllers/authPasswords';
import { authMiddleWare } from '../../../lib/middlewares/authMiddleware';
class AuthRoutes {

    private router: Router;
    private authRouter : Router;
    constructor(){
        this.router = express.Router();
        this.authRouter = express.Router();
    }

    public routes():Router{
        this.router.post('/signup', SignUp.prototype.create );
        this.router.post('/signin', SignIn.prototype.read );
        this.router.post('/password/reset', AuthedPasswords.prototype.sendResetSetPassword );
        this.router.post('/password/update/:hash', AuthedPasswords.prototype.updatePassword );
        return this.router;
    }


    public authedRoute(): Router {
        this.authRouter.get('/authed', authMiddleWare.checkAuth, AuthedUser.prototype.read);
        return this.authRouter;
    }

    public signoutRoute(): Router {
        this.router.get('/signout', SignOut.prototype.signout);
        return this.router;
    }


}


export const authRoutes:AuthRoutes = new AuthRoutes();
