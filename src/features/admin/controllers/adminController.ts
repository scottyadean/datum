
import { Express, Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import HTTP_STATUS from 'http-status-codes';

import { adminService } from '../../../lib/services/db/adminService';
import { Lang } from '../../../lib/utils/lang';


    export class AdminController {
        
        public async routes( _req: Request, res: Response  ): Promise<void> {
           const app:Express = res.app as Express;
           res.status(HTTP_STATUS.OK).json(Lang.defaultSuccessRes(listEndpoints(app)));
        }

        public async index( _req: Request, res: Response ): Promise<void>{

            try{
                const users = await adminService.index( );
                res.status(HTTP_STATUS.OK).json( Lang.defaultSuccessRes(users) );
            }catch(err){
                res.status(HTTP_STATUS.BAD_REQUEST).json( Lang.defaultErrorRes(`${err}`) );
            }
        }
        
        
        public async updateRoles( req: Request, res: Response ): Promise<void> {
            try{
                const userUpdate = await adminService.updateUserRoles(req.body.id, req.body.roles);
                res.status(HTTP_STATUS.OK).json( Lang.defaultSuccessRes(userUpdate) );
            }catch(err){
                res.status(HTTP_STATUS.BAD_REQUEST).json(Lang.defaultErrorRes(`${err}`) );
            }
        }


    }
