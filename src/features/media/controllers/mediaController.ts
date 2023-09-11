 
    import { Request, Response } from 'express';
    import HTTP_STATUS from 'http-status-codes';
    import { __add_service__ } from '../../../lib/services/db/mediaService';


    export class MediaController {

        public async read( req: Request, res: Response ): Promise<void> {
            try{
                const media = mediaService.getById(req.params.id);
            }catch(err){
                console.log(err);
            }
            
            res.status(HTTP_STATUS.OK).json( { media } );
        }

    }