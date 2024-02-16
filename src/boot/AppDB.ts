import os from 'os';
import mongoose from 'mongoose';
import Logger from 'bunyan';
import { config } from '../config/config';


const log: Logger = config.initLogger('init db');
const connect = () => {
  const url = `${config.DBHOST}`.replace('%ENV%', `${config.ENV}`) || '';

  mongoose.set('strictQuery', true);
  mongoose.connect(url).then(() => {
    const hostname = os.hostname();
    log.info(`connected to mongodb: app running on: ${config.ENV}  ${hostname}`);

}).catch((err) => log.error(err));
};

export const AppDB = () => {
  try {
    connect();
    mongoose.connection.on('disconnected', connect);
  } catch (err) {
    log.error(err);
  }
};
