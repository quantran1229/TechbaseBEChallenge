export default class Util {
    constructor() {
      this.statusCode = null;
      this.data = undefined;
      this.msg = undefined;
    }
  
    setSuccess(statusCode, msg, data) {
      this.statusCode = statusCode || 200;
      this.msg = msg;
      this.data = data;
    }

    setSuccessEmpty(){
        this.statusCode = 204
    }
  
    setError(statusCode, msg, data) {
      this.statusCode = statusCode || 400;
      this.msg = msg;
      this.data = data;
    }
  
    setNotFound(statusCode, msg, data) {
      this.statusCode = 404;
      this.msg = msg;
      this.data = data;
    }
  
    send(ctx) {
      ctx.status = this.statusCode;
      if (ctx.status != 204)
      {
        ctx.body = {
            statusCode: this.statusCode,
            msg: this.msg,
            data: this.data
          }
      }
      return;
    }
  }