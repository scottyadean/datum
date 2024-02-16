import Logger from 'bunyan';
import { createClient } from 'redis';
import { config } from '../../../config/config';
export type RedisClient = ReturnType<typeof createClient>;

export abstract class CacheService {

    public client: RedisClient;
    public log: Logger;

    /**
     * init redis client
     * @param name string log name if set otherwise defaults to cache-logger.
     */
    constructor(name:string|null=null){

        if(name){
            this.log = config.initLogger(name);
        }else{
            this.log = config.initLogger('cache-logger');
        }

        this.client = createClient({url: config.REDIS_HOST});
        this.client.on('error', (error:unknown) => {
            console.log(`error: ${error}`);
        } );
    }

    /**
     * connect to redis services
     */
    async connect(): Promise<void> {
        try {
          await this.client.connect();
        } catch (error) {
          this.log.error(error);
        }
      }

    /**
     * check if connection is connected
     */
    async checkConnection(): Promise<void> {
        if ( !this.client.isOpen ){ await this.connect(); }
    }


}







