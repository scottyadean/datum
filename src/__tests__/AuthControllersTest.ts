// import { Request, Response } from 'express';

// import {jest} from '@jest/globals';
// import { authMockReponse, authMockRequest } from './AuthMocks';
// import { SignUp } from '../features/auth/controllers/signup';
// import { CustomError } from '../lib/utils/errors';

// import { mocked } from 'ts-jest/utils';


describe( 'signup', () => {

    beforeAll(()=>{
        // jest.mock( './features/services/db/cacheService' );
        // jest.mock( './features/services/db/redisService' );
        // jest.mock( './features/services/queue/authQueue' );
        // jest.mock( './features/services/queue/mainQueue' );
        // jest.mock( './features/services/queue/userQueue' );
    });


    test('can run test', () => {
        expect(true).toBeTruthy();
    });

    // it('can log in with validation', ()=>{
    //     const req: Request =  authMockRequest({ }, {

    //         username: '',
    //         email: 'test@test.com',
    //         password: '',
    //         avatarColor: '',
    //         avatarImage: ''

    //     }) as Request;

    //     const res: Response = authMockReponse();

    //     SignUp.prototype.create(req, res).catch(  (error: CustomError) => {
    //         console.log(error);
    //     });

    // });

} );
