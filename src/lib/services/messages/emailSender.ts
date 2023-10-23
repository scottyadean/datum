import nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
//import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '../../../config';



export interface IMailSettings {
    from?: string;
    to: string;
    subject: string;
    html: string;
    text?:string;
}



const log: Logger = config.initLogger('email');

export class EmailSender {


    transporter:SentMessageInfo;
    settings:IMailSettings = { from:'', to:'', subject:'', html:'', text:'' };


    /**
     *
     * @param to
     * @param subject
     * @param html
     * @param text
     */

    public async sendEmail(to:string, subject:string, html:string, text='') : Promise<void>{
        if ( config.NODE_ENV == 'test' || config.NODE_ENV == 'development' ){
            await this.developmentEmail(to, subject, html, text);
        }else{
            await this.productionEmail(to, subject, html, text);
        }
    }

    /**
     * @function productionEmail
     * @description if env === production send on more robust smtp platform
     * @param to // email to
     * @param subject email subject content
     * @param html // html mark up
     * @param text // plan text email
     * @returns Promise <void>
     */
    public async productionEmail(to:string, subject:string, html:string, text=''): Promise<void>{
        sendGridMail.setApiKey(config.EMAIL_KEY!);
        const from = `${config.APP_NAME} ${config.EMAIL_FROM!}`;
        this.setUp(  { from, to, subject, html, text  } );

        try{
            await sendGridMail.send({
                from: `${this.settings.from}`,
                to: this.settings.to,
                subject: this.settings.subject,
                html: this.settings.html,
                text: this.settings.text
            });
            log.error('Email Message Sent');
        }catch(err){
            log.error(`Error Sending Email: ${err}`);
        }

    }

    public async developmentEmail(to:string, subject:string, html:string, text=''): Promise<void>{
            const from = `${config.APP_NAME} ${config.EMAIL_FROM!}`;
            this.setUp(  { from, to, subject, html, text  } );
            this.setTransporter();

            try{
                const info = await this.transporter.sendMail(this.settings);
                log.info(`Email Message Sent: ${info.messageId}`);
            }catch(err){
                log.error(`Error Sending Mail: ${err}`);
            }

    }

    public setTransporter() :void {

        // this.transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: 'claire58@ethereal.email',
        //         pass: 'HxvDw21GjgpccWn4ga'
        //     }
        // });


        // this.transporter = nodemailer.createTransport({
        //     host: config.EMAIL_HOST!,
        //     port: 587,
        //     secure: true,
        //     auth: {
        //       user: config.EMAIL_USER!,
        //       pass: config.EMAIL_PASS!,
        //     },
        //   });


        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'joey.bechtelar@ethereal.email',
                pass: 'FPJBYtVPXw6nXN7Tu8'
            }
        });

    }


    public setUp(settings:IMailSettings) :void {
        this.settings = settings;
    }



}
