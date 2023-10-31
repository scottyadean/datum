import express, { Router } from 'express';
import { AdminController } from '../controllers/adminController';


class AdminRoutes {

    private router: Router;
    private authRouter: Router;

    //init public and private routes
    constructor(){
        this.router = express.Router();
        this.authRouter = express.Router();
    }

    //open routes
    public routes():Router {
        // this.router.get('/admin/index/:session_id',  AdminController.prototype.index );
        this.router.get('/routes',  AdminController.prototype.routes );
        return this.router;
    }

    public authRoutes():Router {
        this.authRouter.get('/index', AdminController.prototype.index );
        this.authRouter.put('/user/roles', AdminController.prototype.updateRoles );
        return this.authRouter;
    }



}

export const adminRoutes:AdminRoutes = new AdminRoutes();
