import { createClient } from 'redis';
import { config } from '../../../config';
export type RedisClient = ReturnType<typeof createClient>;

export abstract class CacheService {


    client: RedisClient;
    //log: Logger;

    constructor( ){
        this.client = createClient({url: config.REDIS_HOST});
        //this.log = config.createLogger(name);
        this.client.on('error', (error:unknown) => {
            console.log(`error: ${error}`);
        } );

    }

}







