import mongoose from 'mongoose';
import { config } from '../config';
import Logger from 'bunyan';

const log: Logger = config.initLogger('init db');
const connect = () => {
  const url = config.DBHOST || '';
  mongoose.set('strictQuery', true);
  mongoose.connect(url).then(() => log.info('connected to mongodb')).catch((err) => log.error(err));
};

const initDBConnection = () => {
  try {
    connect();
    mongoose.connection.on('disconnected', connect);
  } catch (err) {
    log.error(err);
  }
};

export default initDBConnection;
