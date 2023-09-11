import express, { Express } from 'express';
import { AppServer } from './boot/AppServer';
import { AppDB } from './boot/AppDB';
import { config } from './config';

class App {

  private loadConfig() : void {
      config.fileUploadToCloudinary();
  }


  public init(): void {
    this.loadConfig();
    AppDB();
    const app: Express = express();
    const server: AppServer = new AppServer(app, 5000);
    server.start();
    console.log('running on http://localhost:5000');
  }
}

const application: App = new App();
application.init();
