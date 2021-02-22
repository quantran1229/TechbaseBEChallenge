import { util as Util } from "../services";
const util = new Util();

import Parameter from "parameter";
let parameter = new Parameter();

let validateLogin = async (ctx, next) => {
  let data = ctx.request.body;
  //rule for login
  let rule = {
    username: {
      type: "int",
      required: true,
      min: 1,
    },
    password: {
      type: "password",
      required: true,
    },
  };
  let error = parameter.validate(rule, data);
  if (!error) await next();
  else {
    util.setError(400, "Login error", error);
    return util.send(ctx)
  }
};

module.exports = {
    validateLogin
}
