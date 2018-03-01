var TRACE = false;
var redisClient;

var config = require('./config.json')

function setupredisbrige(io)
{
  console.log("setup logger redisbrige call");
  var nsp = io.of('/astro/logs');
  //var nsp = io;
  nsp.on('connection', function(socket)
  {
    console.log("connected /astro/logs :  "+socket);
    var app = socket.handshake.query.app;
    var user = socket.handshake.query.user;
    console.log("/astro/logs query : "+JSON.stringify(socket.handshake.query));
    console.log("/astro/logs userName  : "+user);
    console.log("/astro/logs appName  : "+app);

    socket.on('log.info', getBridgeFor('log.info'));
    socket.on('log.warning', getBridgeFor('log.warning'));
    socket.on('log.error', getBridgeFor('log.error'));
    socket.on('log.debug', getBridgeFor('log.debug'));
    console.log(user +' /astro/logs connected');

    function getBridgeFor(eventname)
    {
      return function(msg)
      {
        if (TRACE)
        console.log("msg : "+JSON.stringify(msg));
        var appinfo=[{ appname:app,
          username:user,
          message:msg.errorMessage,
          data:msg.data,
          type:eventname,
          error_code:msg.errorCode,
          Appversion:0.1
        }];
        console.log ("clientlogger server side ......  "+JSON.stringify(appinfo));
        redisClient.rpush(['astro_applogs',JSON.stringify(appinfo)],(function(err, reply)
        {
          console.log(err, reply);
        }));
      }
    }
    socket.on('disconnect',function(data){
      console.log("disconnected "+user+" user ");
    });
  });
}


module.exports = function(io,trace)
{
  TRACE = trace;
  var redis = require('redis');
  redisClient = redis.createClient(
    {
      host : config['db']['host'],
      port : config['db']['port']
      //console.log("host :::"+host+"port "+port);
    });
    redisClient.on('ready',function()
    {
      console.log("Redis is ready");
      setupredisbrige(io);
    });
    redisClient.on('error',function(err)
    {
      console.log(err);
    });


  }
