
import express, {Router} from 'express';
import { BillsController } from '../controllers/billsController';
import { SessionController } from '../controllers/sessionController';


class BillRoutes {

    private router: Router;
    private authRouter: Router;

    //init public and private routes
    constructor(){
        this.router = express.Router();
        this.authRouter = express.Router();
    }

    //open routes
    public routes():Router {
        this.router.get('/session/index', SessionController.prototype.index );
        this.router.get('/session/read/:slug', SessionController.prototype.read );

        this.router.get('/bill/index/:session_id',  BillsController.prototype.index );
        this.router.get('/bill/read/:id',  BillsController.prototype.read );

        return this.router;
    }

    public authRoutes():Router {
        this.authRouter.post('/session/create', SessionController.prototype.create);
        this.authRouter.post('/bill/create',  BillsController.prototype.create );
        this.authRouter.put('/bill/body/update',  BillsController.prototype.billBodyUpsert );
        this.authRouter.put('/bill/contributor', BillsController.prototype.editContributor);

        return this.authRouter;
    }



}

export const billRoutes:BillRoutes = new BillRoutes();
