import mongoose from 'mongoose';
import Logger from 'bunyan';
import { config } from '../config';

const log: Logger = config.initLogger('init db');
const connect = () => {
  const url = config.DBHOST || '';
  mongoose.set('strictQuery', true);
  mongoose.connect(url).then(() => log.info('connected to mongodb')).catch((err) => log.error(err));
};

export const AppDB = () => {
  try {
    connect();
    mongoose.connection.on('disconnected', connect);
  } catch (err) {
    log.error(err);
  }
};
