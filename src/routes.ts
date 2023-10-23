import { Application } from 'express';
import { authRoutes } from './features/auth/routes/authRoutes';
import { postRoutes } from './features/posts/routes/postsRoutes';
import { billRoutes } from './features/bills/routes/billsRoutes';
import { serverAdapter } from './lib/services/queue/mainQueue';
import { authMiddleWare } from './lib/middlewares/authMiddleware';

const BASE_PATH = '/api/v1';


export default (app: Application) => {
  const routes = () => {

    // queue dashboard
    app.use('/queues', serverAdapter.getRouter());

    //auth services
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());
    app.use(BASE_PATH, authMiddleWare.verifyAuth, authRoutes.authedRoute());

    //posts
    app.use(`${BASE_PATH}/posts`, postRoutes.routes());
    app.use(`${BASE_PATH}/posts`, authMiddleWare.verifyAuth, postRoutes.authRoutes());


    //bills
    app.use(`${BASE_PATH}/legislation`, billRoutes.routes() );
    app.use(`${BASE_PATH}/legislation`, authMiddleWare.verifyAuth, billRoutes.authRoutes());


  };

  routes();
};
