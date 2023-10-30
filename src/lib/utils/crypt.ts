/**
 * welcom to the de crypt mahmahahahaha
 */
import { AES, enc } from 'crypto-js';


export class CryptUtil {

    public static encypt(value:string, secret:string) :string {
        return AES.encrypt(value, secret).toString();
    }

    public static decrypt(cipher:string, secret:string) :string {
        return AES.decrypt(cipher, secret).toString(enc.Utf8);
    }

}

