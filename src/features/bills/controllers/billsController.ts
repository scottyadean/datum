import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { BillService } from '../../../lib/services/db/billService';

import { IAuthDocument } from '../../auth/interfaces/authInterface';
import { IBillBody, IBillDocument } from '../interfaces/billsInterface';
import { Lang } from '../../../lib/utils/lang';

const service: BillService  = new BillService();

export class BillsController {

        /**
         * list all bills by year
         * @method get
         * @param req
         * @param res
         * @returns json
         */
        public async index( req: Request, res: Response ): Promise<void> {
            try{
                const bills = await service.getBills(req.params.session_id);
                res.status(HTTP_STATUS.OK).json( { result: bills, error: null } );
            }catch(err){
                res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes(`${err}`) );
            }
        }

        /**
         * list one bill by id
         * @method get
         * @param req
         * @param res
         * @returns json
         */
        public async read( req: Request, res: Response ): Promise<void> {
            try{
                const bill = await service.getBillById(req.params.id, false);
                res.status(HTTP_STATUS.OK).json( { result: bill, error: null } );
            }catch(err){
                res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes(`${err}`) );
            }
        }

        /**
         * create a new bill with no content.
         * @method post
         * @param req
         * @param res
         * @returns json
         */
        public async create(req: Request, res: Response) : Promise<void> {
            try{
                const { session_id, name, body, type, state, title, subTitle, catagory, sub_catagory, description, summary } = req.body;


                const billBody:IBillBody = {

                    id: new ObjectId(),
                    type: type,
                    title: title,
                    subTitle: subTitle,
                    body: body,
                    status: 'init',
                    style: 'base',
                    version: 1,

                } as IBillBody;


                const id : ObjectId = new ObjectId();
                const user = req.currentUser as IAuthDocument;
                const newBill: IBillDocument = {
                    _id: id,
                    sessionId: `${session_id}`,
                    billHostId: `${user?.userId}`,
                    billNumber: '',
                    name: name,
                    state: state,
                    title: title,
                    catagory: catagory,
                    subCatagory:sub_catagory,
                    description: description,
                    summary: summary,
                    body: [billBody],
                    introducedBy: '',
                    subjects: [],
                    amendments: [],
                    contributors: [],
                    sponsors: [],
                    requestsToEdit: [],
                    notes: [],
                    votesHouse: [],
                    votesSenate: [],
                    keywords: [],
                    documents: [],
                    videos: [],
                    sectionsAffected: []
                } as unknown as IBillDocument;

                const bill = await service.saveBill(newBill);
                res.status(HTTP_STATUS.OK).json({ result: bill, message: Lang.createOk('Bill'), error: null } );
            }catch(err){
                res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes(`${err}`) );
            }
        }


        /**
         * update the body of a bill
         * @method put
         * @param req
         * @param res
         * @returns json
         */
        public async billBodyUpsert(req: Request, res: Response) : Promise<void> {

            try{
                const { id, type, title, subTitle, body, status, version, style, index} = req.body;
                const user = req.currentUser as IAuthDocument;
                const billId : string = ( index === undefined ) ? `${new ObjectId()}` : index;
                const method : string = ( index === undefined ) ? 'insert' : 'update';
                const data: IBillBody = {
                    id: billId,
                    type: type,
                    title: title,
                    subTitle: subTitle,
                    body: body,
                    status: status,
                    style: style,
                    version: parseInt(version) || 1,
                };
                const update = await service.updateBillBody( method, `${id}`, `${user?.userId}`, billId,  data);
                res.status(HTTP_STATUS.OK).json({ result: update, billId: billId, message: Lang.updateOk('Bill Body'), error: null } );
            }catch(err){
                res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
            }

        }


        /**
         * add/remove id to contributor array
         * @param req
         * @param res
         * @returns json
         */
        public async editContributor(req: Request, res: Response) : Promise<void> {
            try{
                const { id, userId, action } = req.body;
                const user = req.currentUser as IAuthDocument;
                const data = await service.assigncontributorId( id, action, `${user?.userId}`, userId );
                let error = null;
                if(data[0] === true){ error = data[2];}
                res.status(HTTP_STATUS.OK).json({ result: data, message: Lang.updateOk('Bill Contributors'), error: error } );
            }catch(err){
                res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
            }
        }

    }
