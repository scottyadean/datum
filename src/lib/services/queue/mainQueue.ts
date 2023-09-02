import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '../../../config';

export let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;
export abstract class MainQueue {

    queue: Queue.Queue;
    log: Logger;

    constructor(name: string){
        this.queue = new Queue(name, `${config.REDIS_HOST}`);
        bullAdapters.push( new BullAdapter(this.queue) );
        bullAdapters = [...new Set( bullAdapters )];
        serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath('/queues');

        createBullBoard({
            queues: bullAdapters,
            serverAdapter
        });

        this.log = config.initLogger(`queue-${name}`);

        this.queue.on( 'completed', (job: Job)=>{
            job.remove();
            this.log.info(' job removed from log ');
        });

        this.queue.on('global:completed', (jobId: string)=> {
            this.log.info( `Job ${jobId} complete` );
        });

        this.queue.on( 'global:stalled', (jobId: string)=> {
            this.log.info(`Job ${jobId} is stalled`);
        });

    }


    protected addJob(name: string, data: any): void{
        this.queue.add( name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } } );
    }

    protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void> ) : void{
        this.queue.process(name, concurrency, callback);
    }


}

