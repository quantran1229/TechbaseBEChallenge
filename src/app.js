import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import routers from './routers';
import morgan from 'koa-morgan'
require('dotenv').config()

const app = new Koa();
app
  .use(bodyParser({
    enableTypes: ['json'],
    extendTypes: ['application/json'],
    onerror: function (err, ctx) {
      ctx.throw('Body parse error', 422);
    }
  }))
  
  if(process.env.NODE_ENV !== 'test') {
    //use morgan to log at command line
    app.use(morgan('tiny'));
}

app.use(routers)

const server = app.listen(process.env.APP_PORT || 3000, process.env.APP_HOST, function () {
  console.log(`App run on ${process.env.APP_HOST}:${process.env.APP_PORT}`)
});

module.exports = server;