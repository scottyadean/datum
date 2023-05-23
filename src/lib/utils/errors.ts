import HTTP_STATUS from 'http-status-codes';

export interface AppErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  errorMessage(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(msg: string) {
    super(msg);
  }

  errorMessage(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode: number = HTTP_STATUS.BAD_REQUEST;
  status = 'error';
  constructor(msg: string) {
    super(msg);
  }
}

export class NotFoundError extends CustomError {
  statusCode: number = HTTP_STATUS.NOT_FOUND;
  status = 'error';
  constructor(msg: string) {
    super(msg);
  }
}

export class NoAuthError extends CustomError {
  statusCode: number = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';
  constructor(msg: string) {
    super(msg);
  }
}

export class FileTooBigError extends CustomError {
  statusCode: number = HTTP_STATUS.REQUEST_TOO_LONG;
  status = 'error';
  constructor(msg: string) {
    super(msg);
  }
}

export class ServerError extends CustomError {
  statusCode: number = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';
  constructor(msg: string) {
    super(msg);
  }
}

export class JoinRequestError extends CustomError {
  statusCode: number = HTTP_STATUS.BAD_REQUEST;
  status = 'error';
  constructor(msg: string) {
    super(msg);
  }
}
