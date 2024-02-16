import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { Lang } from '../../../lib/utils/lang';
import { Helpers } from '../../../lib/utils/helpers';
import { ISessionDocument } from '../interfaces/billsInterface';
import { BillService } from '../../../lib/services/db/billService';
import { IAuthDocument } from '../../auth/interfaces/authInterface';



const service: BillService = new BillService();

export class SessionController {


    public async index ( req: Request, res: Response ): Promise<void> {
        try{
            const year = ( req.query.year ) ? parseInt(`${req.query.year}`) : null;
            let years = ( req.query.years ) ? `${req.query.years}`.split('|').map(y=>parseInt(`${y}`)) : null;
            const active = ( req.query.active ) ? true : null;
            if( req.query.range ) {
                const range =  `${req.query.range}`.split('|');
                years = Helpers.rangeSet(parseInt(range[0]), parseInt(range[1]) ).map(y=>parseInt(`${y}`));
            }
            const sess = await service.sessionIndex(year, years, active);
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
            const { name, state, year, description, start, end, sesson } = req.body;
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
                sesson: sesson,
            } as ISessionDocument;

            await service.saveSession(newSession);
            res.status(HTTP_STATUS.OK).json({ result: newSession, message: Lang.createOk('Session'), error: null } );
        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes(`${err}`) );
        }
    }


    public async import(req: Request, res: Response) : Promise<void> {
        try{

            const addYears = (date:string, years=1) : string =>  {
                const dateCopy = new Date(date);  dateCopy.setFullYear(dateCopy.getFullYear() + years);
                return dateCopy.toISOString();
            };

            const user = req.currentUser as IAuthDocument;
            const { roles } = user;
            const { sessions } = req.body;
            const results:string[] = [];
            const errors:string[] = [];

            if( `${roles}`.search('sudo') === -1 ){
                res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes('Must be Admin or Sudo') );
                return;
            }

            sessions.forEach( async (s: any, idx: any) => {

                try{
                    const id : ObjectId = new ObjectId();
                    const start_d = new Date(`${s['@Session_Start_Date']}`).toISOString();
                    let end_d = addYears(`${s['@Session_Start_Date']}`);
                    if (Object.prototype.hasOwnProperty.call(s, '@Sine_Die_Date') ){
                        end_d = new Date(`${s['@Sine_Die_Date']}`).toISOString();
                    }

                    const newSession: ISessionDocument = {
                        _id: id,
                        name: `${s['@Session_Full_Name']}`,
                        state: 'AZ',
                        origin_id: parseInt ( s['@Session_ID'] ),
                        year: parseInt ( s['@Legislation_Year'] ),
                        description: `${s['@Session_Full_Name']}`,
                        start_date: new Date(start_d),
                        end_date: new Date(end_d),
                        sesson: `${s['@Session']}`,
                    } as ISessionDocument;

                    results.push(`${s['@Session_Full_Name']}`);

                    await service.saveSession(newSession);

                }catch(err){
                   errors.push(`${s['@Session_Full_Name']}`);
                }

            });


            res.status(HTTP_STATUS.OK).json({ result: results,  message: Lang.createOk('Sessions'), error: errors } );


        }catch(err){
            res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes(`${err}`) );
        }
    }

}
