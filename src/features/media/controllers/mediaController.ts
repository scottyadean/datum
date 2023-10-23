
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class MediaController {

    public async read( _req: Request, res: Response ): Promise<void> {
        res.status(HTTP_STATUS.OK).json( { hello:'world' } );
    }

}
