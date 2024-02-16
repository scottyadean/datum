import { MainQueue } from './mainQueue';
import {UploadService} from '../../services/db/uploadService';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import {config} from '../../../config/config';

const log: Logger = config.initLogger('authWorker');
const imgUpload : UploadService = new UploadService();

export interface IFileUploadDoc {
    file: string;
    key: string;
}

export class UploadWorker {
    public async uploadFile( job: Job, done: DoneCallback ) :Promise<void> {
        try{
            const { value } = job.data;
            await imgUpload.uploadFile( `${value.file}`, `${value.key}`, true, true );
            job.progress(100);
            done(null, job.data);
        }catch(err){
            log.error(err);
            done(err as Error);
        }
    }
}

export class MediaQueue extends MainQueue{

    public name = 'mediaQueue';

    constructor(){
        super('media');
        const uploadWoker : UploadWorker = new UploadWorker();
        this.processJob(this.name, 5, uploadWoker.uploadFile);
    }

    public addUploadJob(data: IFileUploadDoc) :void {
        this.addJob(this.name, data);
    }

}








