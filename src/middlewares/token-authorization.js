import jwt from "jsonwebtoken";

import {
  util as Util
} from "../services";
const util = new Util();

module.exports = {
  validateToken: async (ctx, next) => {
    const key = process.env.JWT_SECRET_KEY; //read from env

    //check through header for token
    const authorizationHeaader = ctx.request.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = ctx.request.headers.authorization.split(" ")[1]; // Bearer <token>
      try {
        result = await jwt.verify(token, key);
        //store info of user into state
        ctx.state.user = {
          id:result.id,
          type:result.type
        }
        await next();
      } catch (err) {
        util.setError(400, "Invalid token" + err.toString());
        return util.send(ctx);
      }
    } //check through query for token
    else if (ctx.request.query.token) {
      const token = ctx.request.query.token;
      try {
        result = await jwt.verify(token, key);
        //store info of user into state
        ctx.state.user = {
          id:result.id,
          type:result.type
        }
        await next();
      } catch (err) {
        util.setError(400, "Invalid token" + err.toString());
        return util.send(ctx);
      }
    } else {
      util.setError(401, "Authentication error. Token required.");
      return util.send(ctx);
    }
  },
};
