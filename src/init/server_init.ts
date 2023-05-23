import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import compression from 'compression';
import { config } from '../config';
import HTTP_STATUS from 'http-status-codes';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import 'express-async-errors';
import AppRoutes from '../routes';
import Logger from 'bunyan';
import { AppErrorResponse, CustomError } from 'src/lib/utils/errors';

const log: Logger = config.initLogger('server init');

export class AppServer {
  //express app var.
  private app: Application;
  private port: number;

  // init the app. vars
  constructor(app: Application, port: number) {
    this.port = port;
    this.app = app;
  }

  // start the express server.
  public start(): void {
    this.baseMW(this.app);
    this.routeMW(this.app);
    this.errorMW(this.app);
    this.initServer(this.app);
  }

  // security middleware
  private baseMW(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: ['app1', 'app2'],
        maxAge: 24 * 7 * 360000,
        secure: config.ENV === 'development' ? false : true
      })
    );

    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CORS,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );

    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  // route middleware
  private routeMW(app: Application): void {
    AppRoutes(app);
  }

  // global error middleware
  private errorMW(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
      app.use((error: AppErrorResponse, _req: Request, res: Response, next: NextFunction) => {
        log.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.errorMessage());
        }
        next();
      });
    });
  }

  private async initServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const io: Server = await this.initSocketIo(httpServer);
      this.initSocketIO(io);
      this.initHttpServer(httpServer);
    } catch (err) {
      log.info(err);
    }
  }

  private async initSocketIo(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CORS,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });

    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private initHttpServer(httpServer: http.Server): void {
    httpServer.listen(this.port, () => {
      log.info(`server is running on ${this.port} `);
    });
  }

  private initSocketIO(io: Server): void {
    log.info(io._connectTimeout);
  }
}
