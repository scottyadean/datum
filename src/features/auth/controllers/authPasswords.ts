import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { IAuthDocument } from '../../../features/auth/interfaces/authInterface';
import { authService } from '../../../lib/services/db/authService';
import { emailQueue } from '../../../lib/services/queue/emailQueue';
import { PasswordTmpls } from '../../../lib/services/messages/templates/passwordTmpls';
import { BadRequestError } from '../../../lib/utils/errors';
import { Helpers } from '../../../lib/utils/helpers';


export class AuthedPasswords{

    public async sendResetSetPassword( req: Request, res: Response ): Promise<void>{

       let sent = true;
       let status = HTTP_STATUS.OK;
       let error = '';

        try{
            const { email } = req.body;
            const user : IAuthDocument = await authService.getAuthUser('email',  email);

            if( !user ){
                throw new BadRequestError('Invalid Credentials');
            }

                const hash = Helpers.randomHash();
                const exp  = Helpers.addHoursToDate(1).getTime();

                await authService.setPasswordToken( `${user._id!}`, hash, exp );
                const emailTmpl :PasswordTmpls = new PasswordTmpls();
                const html = emailTmpl.forgotPasswordTmpl({  title: 'Follow the link to reset your password',
                                                             name: user.username,
                                                             exp: exp,
                                                             hash: hash,
                                                             link: 'http://localhost:5000/password/update'
                                                    });

                emailQueue.sendEmail({to: email, subject:'Reset Email', html: html});

        }catch(err){
            sent = false;
            status = HTTP_STATUS.BAD_REQUEST;
            error = `${err}`;
        }

        res.status(status).json( { sent: sent, error: error } );
    }


    public async updatePassword(req: Request, res: Response): Promise<void> {

        const hash = req.params['hash'];
        const {  password, confirm_password  } = req.body;

        if (  password !== confirm_password ) {
            throw new BadRequestError('Passwords Do Not Match');
        }

        const user : IAuthDocument = await authService.getUserByResetToken( hash );

        if (!user){
            throw new BadRequestError('Invalid Credentials');
        }

        const currentTime = `${new Date().getTime()}`;
        const tokenTime = `${user.passwordResetExpires}`;
        if ( parseInt(tokenTime) < parseInt(currentTime) ){
            throw new BadRequestError('Reset Link Expired');
        }

        user.password = password;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        await user.save();

        const emailTmpl :PasswordTmpls = new PasswordTmpls();
        const html = emailTmpl.resetPasswordTmpl({  title: 'Password has been updated',
                                                    name: user.username,
                                                    exp: new Date().getTime(),
                                                    hash: '',
                                                    link: ''});

        emailQueue.sendEmail({to: user.email, subject:'Reset Email', html: html});
        res.status(HTTP_STATUS.OK).json( { set: true , error: null } );

    }


}
