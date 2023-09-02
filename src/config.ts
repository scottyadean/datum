import dotenv from 'dotenv';
import bunyan from 'bunyan';
dotenv.config({});

class Config {
  public DBHOST: string | undefined;
  public ENV: string | undefined;
  public NODE_ENV: string | undefined;
  public JWT_SECRET: string | undefined;
  public CORS: string | undefined;
  public REDIS_HOST: string | undefined;
  public LOG_LEVEL: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_SECRET: string | undefined;
  public CLOUD_KEY: string | undefined;

  constructor() {
    this.DBHOST = process.env.DBHOST || '';
    this.ENV = process.env.ENV || 'development';
    this.NODE_ENV = process.env.ENV || this.ENV;
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.CORS = process.env.CORS || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_SECRET = process.env.CLOUD_SECRET || '';
    this.CLOUD_KEY = process.env.CLOUD_KEY || '';
  }

  public initLogger(name: string): bunyan {
    let level: bunyan.LogLevel = 'debug';
    if (this.LOG_LEVEL == 'error') {
      level = 'error';
    } else if (this.LOG_LEVEL == 'info') {
      level = 'info';
    } else if (this.LOG_LEVEL == 'fatal') {
      level = 'fatal';
    }
    return bunyan.createLogger({ name, level });
  }
}

export const config: Config = new Config();
