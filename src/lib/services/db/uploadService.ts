import cloudinary from 'cloudinary';
import {UploadApiResponse, UploadApiErrorResponse} from 'cloudinary';



export class UploadService{

        public async uploadFile(file:string, public_id?:string, overwrite?: boolean, invalidate?: boolean)
        : Promise<UploadApiResponse|UploadApiErrorResponse|undefined> {
            return new Promise((resolove)=> {
                cloudinary.v2.uploader.upload(file, { public_id, overwrite, invalidate },
                    (error: UploadApiErrorResponse|undefined, result:UploadApiResponse|undefined) => {
                        if( error ){ resolove(error); }
                        resolove(result);
                });

            });
        }




}
