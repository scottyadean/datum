import { Application } from 'express';

import { authMiddleWare } from './lib/middlewares/authMiddleware';
import { serverAdapter } from './lib/services/queue/mainQueue';

import { adminRoutes } from './features/admin/routes/adminRoutes';
import { authRoutes } from './features/auth/routes/authRoutes';
import { billRoutes } from './features/bills/routes/billsRoutes';
import { postRoutes } from './features/posts/routes/postsRoutes';
import { userRoutes } from './features/user/routes/userRoutes';
import expressListRoutes from 'express-list-routes';



const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {

    // queue dashboard
    app.use('/queues', serverAdapter.getRouter());

    //auth services
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());
    app.use(BASE_PATH, authMiddleWare.verifyAuth, authRoutes.authedRoute());

    //admin services
    app.use(`${BASE_PATH}/admin`, authMiddleWare.verifyAuth, adminRoutes.routes());
    app.use(`${BASE_PATH}/admin`, authMiddleWare.checkAdmin, adminRoutes.authRoutes());

    //user services
    app.use(`${BASE_PATH}/user`, authMiddleWare.verifyAuth, userRoutes.routes());

    //posts
    app.use(`${BASE_PATH}/posts`, postRoutes.routes());
    app.use(`${BASE_PATH}/posts`, authMiddleWare.verifyAuth, postRoutes.authRoutes());

    //bills
    app.use(`${BASE_PATH}/legislation`, billRoutes.routes() );
    app.use(`${BASE_PATH}/legislation`, authMiddleWare.verifyAuth, billRoutes.authRoutes());


    app.get( `${BASE_PATH}/routes`, (_req, _res) => {
        interface routeListI {
            method: string;
            path: string;
        }
        const routelist = expressListRoutes(app._router, { prefix: `${BASE_PATH}` });
        const output:routeListI[] = [];
        routelist.forEach((r)=> {
          r.path = r.path.replace(/\\/ig, '/');
            output.push(r);
        });

        _res.status(200).send( {routes: output } );
    });

  };

  routes();



};
