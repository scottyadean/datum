import express, { Express } from 'express';
import { AppServer } from './init/server_init';
import initDBConnection from './init/db_init';

class App {
  public init(): void {
    initDBConnection();
    const app: Express = express();
    const server: AppServer = new AppServer(app, 5000);
    server.start();
    console.log('running on http://localhost:5000');
  }
}

const application: App = new App();
application.init();
