import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';


import { IAuthDocument, ISignUpData } from '../interfaces/authInterface';
import { IUserDocument, initialUserdata } from '../../user/interfaces/userInterface';
import { BadRequestError } from '../../../lib/utils/errors';
import { authService } from '../../../lib/services/db/authService';
import { authQueue } from '../../../lib/services/queue/authQueue';
import { userQueue } from '../../../lib/services/queue/userQueue';
import { UserCache } from '../../../lib/services/cache/users/UserCache';
import { config } from '../../../config';
import { Lang } from '../../../lib/utils/lang';


// TODO implement photo upload
// import { UploadService } from '../../../lib/services/db/uploadService';
// import { authValidation } from '../../../lib/decorators/authValidation';
// import { signupSchema } from '../schemes/signup';


const userCache: UserCache = new UserCache();

export class SignUp {
  /**
   * Create a new user: note it splits private and public data into two models USER and Auth
   * @param req
   * @param res
   * @returns json
   */

  //@authValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, displayName } = req.body;
    const checkIfUserExists: IAuthDocument = await authService.getUserByUserNameorEmail(username, email);
    if (checkIfUserExists) {
      throw new BadRequestError('Invalid creds');
    }

    const authObjectId: ObjectId = new ObjectId();
    //const userObjectId: ObjectId = new ObjectId();
    const uId = `${new Date().getTime()}`;
    const authData: IAuthDocument = SignUp.signUpData({ _id: authObjectId, uId, username, email, password, avatarColor });

    // Store User profile in Cache
    const userData: IUserDocument = initialUserdata(`${authObjectId}`, uId, username, displayName, email, avatarColor);
    userCache.saveUserToCache(`${authObjectId}`, uId, userData);

    // Add to user Database minus the sensitive auth data
    authQueue.addAuthUserJob({ value: authData });

    // omit the auth data from the public user data.
    omit(userData, ['username', 'email', 'avatarColor', 'password', 'passwordResetToken', 'passwordResetExpires']);
    userQueue.addUserJob({ value: userData });

    //assign the user to the current session
    const jwt: string = SignUp.getToken(authData, authObjectId);
    req.session = { jwt: jwt };

    //return the successful
    res.status(HTTP_STATUS.CREATED).json({ result: userData, message: Lang.createOk('User') });
  }

  /**
   * encode the jwt with the user info
   * @param data
   * @param userObjectId
   * @returns String
   */
  public static getToken(data: IAuthDocument, userObjectId: ObjectId): string {
    const sup = {
      userId: userObjectId,
      uId: data.uId,
      email: data.email,
      username: data.username,
      acolor: data.avatarColor
    };

    return JWT.sign(sup, config.JWT_SECRET!);
  }

  /**
   *  return the private auth data from the user object.
   * @param data
   * @returns IAuthDocument
   */
  public static signUpData(data: ISignUpData): IAuthDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return { _id, uId, username, email, password, avatarColor, createdAt: new Date() } as IAuthDocument;
  }
}
