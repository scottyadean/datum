import dotenv from 'dotenv';
import bunyan from 'bunyan';
dotenv.config({});

class Config {
  public DBHOST: string | undefined;
  public ENV: string | undefined;
  public NODE_ENV: string | undefined;
  public JWTSECRET: string | undefined;
  public CORS: string | undefined;
  public REDIS_HOST: string | undefined;
  public LOG_LEVEL: string | undefined;

  constructor() {
    this.DBHOST = process.env.DBHOST || '';
    this.ENV = process.env.ENV || 'development';
    this.NODE_ENV = process.env.ENV || this.ENV;
    this.JWTSECRET = process.env.SECRET || '';
    this.CORS = process.env.CORS || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
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
