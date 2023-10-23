import { Response } from 'express';
import { AuthPayload, IAuthDocument  } from '../../features/auth/interfaces/authInterface';

export interface IMockJWT {
    jwt?: string;

}

export interface IMockBody{
    _id?: string;
    uId?: string;
    email?: string,
    username?: string,
    password?: string,
    avatarColor?: string,
    avatarImage?: string,
    createdAt? : Date | string
}


export const authMockRequest  = ( sessionData: IMockJWT, body: IMockBody, currentUser?: AuthPayload | null, params?: any ) => ({
    session: sessionData,
    body,
    params,
    currentUser
});


export const authMockReponse = () : Response => {
    const res: Response = {} as Response;
    res.status = jest.fn().mockReturnValue( res );
    res.json = jest.fn().mockReturnValue( res );
    return res;
};

export interface IAuthMock {
    _id?: string;
    username?: string;
    email?: string;
    uId?: string;
    password?: string;
    avatarColor?: string;
    avatarImage?: string;
    createdAt?: Date | string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    quote?: string;
    work?: string;
    school?: string;
    location?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    messages?: boolean;
    reactions?: boolean;
    comments?: boolean;
    follows?: boolean;
  }

  export const authUserPayload: AuthPayload = {
    userId: '60263f14648fed5246e322d9',
    uId: '1621613119252066',
    username: 'Manny',
    email: 'manny@me.com',
    avatarColor: '#9c27b0',
    iat: 12345
  };

  export const authMock = {
    _id: '60263f14648fed5246e322d3',
    uId: '1621613119252066',
    username: 'Manny',
    email: 'manny@me.com',
    avatarColor: '#9c27b0',
    createdAt: '2022-08-31T07:42:24.451Z',
    save: () => {console.log('test');},
    comparePassword: () => false
  } as unknown as IAuthDocument;


  export const AuthControllerMock = () : void => {
    jest.mock( './features/services/db/cacheService' );
    jest.mock( './features/services/db/redisService' );
    jest.mock( './features/services/queue/authQueue' );
    jest.mock( './features/services/queue/mainQueue' );
    jest.mock( './features/services/queue/userQueue' );
};
