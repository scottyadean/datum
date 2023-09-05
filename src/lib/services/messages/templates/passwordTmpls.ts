
import { EmailMarkup } from './emailMarkup';
import {config} from '../../../../config';

export interface IPasswordEmailTmplProps {
    title: string;
    name: string;
    exp: number;
    hash: string;
    link: string;
}

const emailMarkup: EmailMarkup = new  EmailMarkup();

export class PasswordTmpls{

    public forgotPasswordTmpl( props: IPasswordEmailTmplProps ) : string {

        const { title, name, exp, link, hash } = props;

        const content = `
            <h1> ${config.APP_NAME!} Forgot Password </h1>
            <p> ${title} </p>
            <div> Hello ${name} forgot password </div>
            <div> <a href="${link}/${hash}"> Reset Link </a> </div>
            <div> ${link}/${hash}  </div>
            <div> sent ${exp} expires in 1 hour </div>`;
        return  emailMarkup.emailContent(content);
    }


    public resetPasswordTmpl( props: IPasswordEmailTmplProps ) : string {

        const { title, name, exp } = props;

        const content = `<h1> ${config.APP_NAME!} Reset Password Conformation </h1>
                            <p> ${title} </p>
                            <div> Hello ${name}, We are notifying you because your password was recently been reset. </div>
                            <div>Updated: ${new Date(exp)} </div>`;
        return emailMarkup.emailContent(content);
    }

}
