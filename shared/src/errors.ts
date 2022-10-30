export class CustomError extends Error {
  context: any = null;

  constructor(msg: string, context: any) {
    super(msg);

    this.context = context;
  }

  toJSON() {
    const ret: { message: string; [key: string]: any } = {
      message: this.message,
    };

    if (process.env.NODE_ENV == 'development') {
      ret.stack = this.stack;
      ret.context = this.context;
    }

    return ret;
  }
}

export class APIError extends CustomError {
  responseCode: number = 500;

  constructor(msg: string, context: any, responseCode: number | void) {
    super(msg, context);

    if (responseCode) {
      this.responseCode = responseCode;
    }
  }
}

export default {
  CustomError,
  APIError,
};