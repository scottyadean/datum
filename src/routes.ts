import { Application } from 'express';
import { authRoutes } from './features/auth/routes/authRoutes';
import { serverAdapter } from './lib/services/queue/mainQueue';
import { authMiddleWare } from './lib/middlewares/authMiddleware';

const BASE_PATH = '/api/v1';


export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());


    app.use(BASE_PATH, authRoutes.signoutRoute());
    app.use(BASE_PATH, authMiddleWare.verifyAuth, authRoutes.authedRoute());
  };

  routes();
};
