


export const AuthControllerMock = () : void => {
    jest.mock( './features/services/db/cacheService' );
    jest.mock( './features/services/db/redisService' );
    jest.mock( './features/services/queue/authQueue' );
    jest.mock( './features/services/queue/mainQueue' );
    jest.mock( './features/services/queue/userQueue' );
};
