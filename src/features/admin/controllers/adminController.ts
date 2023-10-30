
    import { Request, Response } from 'express';
    import HTTP_STATUS from 'http-status-codes';
    import { adminService } from '../../../lib/services/db/adminService';
    import { Lang } from '../../../lib/utils/lang';

    export class AdminController {

        public async read( req: Request, res: Response ): Promise<void> {
            try{
                const userUpdate = adminService.updateUserRoles(req.body.id, req.body.roles);
                res.status(HTTP_STATUS.OK).json( Lang.defaultSuccessRes(userUpdate) );
            }catch(err){
                console.log(err);
                res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes(`${err}`) );
            }

        }

    }
