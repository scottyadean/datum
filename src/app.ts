import express, { Express } from 'express';
import { AppServer } from './init/server_init';
import initDBConnection from './init/db_init';

class App {
  public init(): void {
    initDBConnection();
    const app: Express = express();
    const server: AppServer = new AppServer(app, 5000);
    server.start();
  }
}

const application: App = new App();
application.init();
