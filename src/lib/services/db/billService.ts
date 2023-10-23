import Logger from 'bunyan';

import { IBillBody, IBillDocument, ISessionDocument } from '../../../features/bills/interfaces/billsInterface';

import { BillModel } from '../../../features/bills/models/billModel';
import { SessionModel } from '../../../features/bills/models/sessionModel';
import { RedisService } from './redisService';
import { config } from '../../../config';
import { Helpers } from '../../utils/helpers';
import { UserModel } from '../../../features/user/schemes/userSchema';

export class BillService{

    public redisService: RedisService;
    public logger: Logger;

    constructor(){
        this.redisService = new RedisService();
        this.logger = config.initLogger('bill-service');
    }

    public async getSessions(): Promise<Array<ISessionDocument>|null>{
        try{
           const sess = await SessionModel.find({year: new Date().getFullYear() });
           console.log(sess);
           return sess;
        } catch(err){
            this.logger.error(err);
            console.log(err);
        }
        return null;
    }

    public async saveSession(session:ISessionDocument): Promise<void>{
        try{
            await SessionModel.create(session);
        } catch(err){
            this.logger.error(err);
        }
    }

    public async updateSession(id: string, data:ISessionDocument) : Promise<boolean> {
        try{
            const session = await SessionModel.findOne({_id: `${id}`});
            if ( !session ){ return false; }
            session.update({...data});
            const res = await SessionModel.updateOne({_id: `${id}`}, { ...data });
            return res.acknowledged;
        }catch(err){
            this.logger.error(err);
        }
        return false;
    }

    public async getSessionById(id:string, asJson=true) : Promise<string|ISessionDocument|null> {
        try{
            const sess =  await SessionModel.findById(id);
            if(sess) {
                return (asJson) ? JSON.stringify(sess) : sess;
            }
        }catch(err){
            this.logger.error(err);
        }
        return '';
    }

    public async getSessionBySlug(slug:string, asJson=true) : Promise<string|ISessionDocument|null> {
        try{
            const sess = await SessionModel.findOne({ slug: slug });
            if(sess) {
                return (asJson) ? JSON.stringify(sess) : sess;
            }
        }catch(err){
            this.logger.error(err);
        }
        return '';
    }


    /**
     * @description check if the bill document includes the user id as a contributor.
     * @param bill
     * @param contributorId
     * @returns boolean
     */
    public canEditBill( bill: IBillDocument, contributorId:string ) : boolean {
        // if bill host id or contribitors does not contain the user id
        if ( `${bill?.billHostId}` === `${contributorId}` ){
            return true;
        }

        if (   Helpers.getArrayIndex( bill?.contributors, 'userId', contributorId ) ) {
            return true;
        }
        return false;
    }


    /**
     * Update the array of contributors
     * @param id
     * @param action
     * @param adminId
     * @param userId
     * @returns Arrary [ error:true|false, collection, message ]
     */
    public async assigncontributorId( id:string, action:string, adminId:string, userId:string)  : Promise<Array<unknown>> {

        // get the user and bill model we use the user to append to the contributors array
        const bill = await BillModel.findOne({_id: `${id}`});
        const user = await UserModel.findOne( {_id: `${userId}`} );

        // make sure we have records to work with
        if ( !bill || !bill?.contributors ){
            return [ true, [], 'bill not found with that id'];
        }

        if(!user) {
            return [ true, [], 'user not found with that id '];
        }

        if ( `${bill?.billHostId}` !== `${adminId}` ){
            return [ true, [], 'not allowed to modify record, must be bill host'];
        }

        // set up a place holder var for the query var for the upsert statment.
        let query = null;

        // get the index of the user id if any
        const idx = Helpers.getArrayIndex( bill.contributors, 'userId', `${user._id}` );

        // if add to array
        if( action === 'add' ){
            if ( idx === -1 ){
                query = { $push: { contributors:  {userId: `${user._id}`, img: user.profilePicture, fullname: ''} } , updatedAt: new Date() };
            }else{
                const resp = (bill?.contributors) ? bill?.contributors : [];
                return [false,  resp , `no action taken: contributor aleardy in array: tried: ${action}`];
            }
        }

        // if remove from array
        if (action === 'remove'){
            if ( idx !== -1 ){
                bill.contributors.splice(idx, 1);
                query = { contributors:  bill.contributors, updatedAt: new Date() };
            }else{
                const resp = (bill?.contributors) ? bill?.contributors : [];
                return [ false,  resp , `no action taken: contributor not in array: tried: ${action}`];
            }
        }


        // if query is set update bill with query
        if(query){
            const data = await BillModel.findByIdAndUpdate( { _id: id },  query, {new: true});
            return (data?.contributors) ? [ false,  data?.contributors, `${action}: ${userId} in contributors`] : [null, 'array contributors is empty'];
        }

        //return message if not action taken
        const resp = (bill?.contributors) ? bill?.contributors : [];
        return [true, resp , `no action taken: contributor not updated: tried: ${action}`];

    }


    public async getBills(sessionId:string): Promise<Array<IBillDocument>|null>{
        try{
            const docs = await BillModel.find({ sessionId: sessionId });
            return docs;
        } catch(err){
            this.logger.error(err);
            return null;
        }
    }

    public async saveBill(bill:IBillDocument): Promise<IBillDocument|null>{
        try{
            const doc = await BillModel.create(bill);
            return doc;
        } catch(err){
            this.logger.error(err);
            return null;
        }
    }

    public async updateBill(id: string, contributorId: string, data: IBillDocument) : Promise<boolean> {
        try{
            const bill = await BillModel.findOne({_id: `${id}`});
            if( !bill || !this.canEditBill( bill, contributorId)) {
                return false;
            }
            bill.update({...data});
            //await this.redisService.saveBill({ key: id, post: post });
            const res = await BillModel.updateOne({_id: `${id}`}, { ...data });
            return res.acknowledged;
        }catch(err){
            this.logger.error(err);
        }
        return false;
    }

    public async updateBillBody(method: string, id: string, contributorId: string, billId: string, data: IBillBody) : Promise<Array<unknown>> {
        try{
            const bill = await BillModel.findOne({_id: `${id}`});
            if(!bill) {return ['error', 'bill not found', data]; }
            if(!this.canEditBill(bill as IBillDocument, `${contributorId}`)){ return ['error', 'Can not edit', data]; }

            if ( method === 'insert' || `${bill?.body.length}` === '0' ){
                data.version = 1;
                const insert = await BillModel.updateOne( { _id: id },  { $push: { body: {...data} }, updatedAt: new Date() });
                const result = (insert.acknowledged) ? 'success' : 'error';
                return [result, 'bill body element pushed into array', data];
            }else{
                data.version = (data.version) ? ( parseInt(`${data.version}`) + 1) : 1;
                const body = Helpers.upsertArrayById(billId, data, bill?.body);
                const upsert = await BillModel.updateOne( { _id: id },  { body: body } );
                const result = (upsert.acknowledged) ? 'success' : 'error';
                return [result, 'bill body element updated at index', body];
            }

        }catch(err){
            this.logger.error(err);
            return  ['error', `${err}`, data];
        }
    }



    public async getBillById(id:string, asJson=true) : Promise<string|IBillDocument|null> {
        try{
            // const billjson = await this.redisService.getBill(`bill-${id}`);
            // if ( billjson! ){
            //     return billjson;
            // }
            const bill =  await BillModel.findById(id);
            if(bill) {
                //this.redisService.setBill({key: id, post: post});
                return (asJson) ? JSON.stringify(bill) : bill;
            }

        }catch(err){
            this.logger.error(err);
        }

        return '';
    }




    private updateCount(count:string) : number {
        let cnt =( +count ) as number;
        return ( cnt += 1 ) as number;
    }




}
