
import { IAuthDocument, ISignUpData } from '../interfaces/authInterface';


export class AuthModelMethods {

  /**
   * return the private auth data from the user object.
   * @param data
   * @returns IAuthDocument
   */
  public static signUpData(data: ISignUpData): IAuthDocument {
    const {  _id, uId, username, email, password, avatarColor } = data;
    return { _id, uId, username, email, password, avatarColor, createdAt: new Date() } as IAuthDocument;
  }


}
