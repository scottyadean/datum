import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { BillService } from '../../../lib/services/db/billService';
import { ISessionDocument } from '../interfaces/billsInterface';
//import { IAuthDocument } from '../../auth/interfaces/authInterface';

import { Lang } from '../../../lib/utils/lang';


const service: BillService = new BillService();

export class SessionController {


    public async index ( req: Request, res: Response ): Promise<void> {
        try{
            const year = ( req.query.year ) ? parseInt(`${req.query.year}`) : null; 
            const years = ( req.query.years ) ? `${req.query.years}`.split('|').map(y=>parseInt(`${y}`)) : null; 
            const sess = await service.sessionIndex(year, years);
            res.status(HTTP_STATUS.OK).json( { result: sess, error: null  } );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
        }
    }

    public async read( req: Request, res: Response ): Promise<void> {
        try{
            const sess = await service.getSessionBySlug(req.params.slug, false);
            res.status(HTTP_STATUS.OK).json( { result: sess, error: null  } );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
        }
    }

    public async create(req: Request, res: Response) : Promise<void> {
        try{
            const { name, state, year, description, start, end, special } = req.body;
            const id : ObjectId = new ObjectId();
            //const user = req.currentUser as IAuthDocument;
            const newSession: ISessionDocument = {
                _id: id,
                name: name,
                state: state,
                year: year,
                description: description,
                start_date: new Date(start),
                end_date: new Date(end),
                special: special,
            } as ISessionDocument;

            await service.saveSession(newSession);
            res.status(HTTP_STATUS.OK).json({ result: newSession, message: Lang.createOk('Session'), error: null } );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes(`${err}`) );
        }
    }

}
