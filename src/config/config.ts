import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary  from 'cloudinary';
dotenv.config({});

class Config {

  public APP_NAME: string|undefined;
  public DBHOST: string | undefined;
  public ENV: string | undefined;
  public NODE_ENV: string | undefined;
  public JWT_SECRET: string | undefined;
  public CORS: string | undefined;
  public REDIS_HOST: string | undefined;
  public LOG_LEVEL: string | undefined;
  public CLOUD_URL: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_SECRET: string | undefined;
  public CLOUD_KEY: string | undefined;

  // email config
  public EMAIL_FROM: string | undefined;
  public EMAIL_KEY: string | undefined;
  public EMAIL_USER: string | undefined;
  public EMAIL_PASS: string | undefined;
  public EMAIL_HOST: string | undefined;


  constructor() {
    this.APP_NAME = process.env?.APP_NAME;
    this.DBHOST = process.env.DBHOST || '';
    this.ENV = process.env.ENV || 'development';
    this.NODE_ENV = process.env.ENV || this.ENV;
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.CORS = process.env.CORS || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

    this.CLOUD_URL = process.env?.CLOUD_URL;
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_SECRET = process.env.CLOUD_SECRET || '';
    this.CLOUD_KEY = process.env.CLOUD_KEY || '';

    this.EMAIL_FROM = process.env?.EMAIL_FROM;
    this.EMAIL_KEY = process.env?.EMAIL_KEY;
    this.EMAIL_USER = process.env?.EMAIL_USER;
    this.EMAIL_PASS = process.env?.EMAIL_PASS;
    this.EMAIL_HOST = process.env?.EMAIL_HOST;

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

  public fileUploadToCloudinary() : void {

      cloudinary.v2.config({
          cloud_name: this.CLOUD_NAME,
          api_key: this.CLOUD_KEY,
          api_secret: this.CLOUD_SECRET
      });


  }

}




export const config: Config = new Config();
