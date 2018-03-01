var TRACE = false;
var redisClient;
var config = require('./config.json');

function setupredisbrige(io)
{
  console.log("setupredisbrige data getdata_ingest call");
  var NSP = io.of('/astro/xchangeloc');
  NSP.on('connection', function(socket)
  {
    console.log("connected /astro/xchangeloc :  "+socket);
    var app = socket.handshake.query.app;
    var user = socket.handshake.query.user;
    console.log("/astro/xchangelo _query  :  "+JSON.stringify(socket.handshake.query));
    console.log("/astro/xchangelo username : "+user);
    console.log("/astro/xchangelo appName : "+app);
    socket.on('location.update', getBridgeFor('location.update'));
    //   socket.on('location.subcribe', function(msg)
    //   {
    //     subscribeTo(getRoomname(msg),socket);
    //    });
    //
    //    function subcribeTo(roomname,socket)
    //    {
    //      socket.join(roomname);
    //
    //    }
    //
    // function getRoomname(msg)
    // {
    //   if(msg.roomName) throw {code:500,error:"no roomname in message "+JSON.stringify(msg)};
    // return  msg.roomname;
    // }
    function getBridgeFor(eventname)
    {
      return function(msg)
      {
        if (TRACE)
        var id = socket.id
        //   if(msg.room_name) throw {code:500,error:"no roomname in message "+JSON.stringify(msg)};
        var room_Name=msg.room_name;
        console.log("room name : "+room_Name);
        socket.join(room_Name);
        var appData_ingestInfo=[{ appname:app,
          username:user,
          message:msg,
          type:eventname,
          roomName:room_Name,
          version:0.1
        }];
        console.log("client dataingest :"+JSON.stringify(appData_ingestInfo));
        redisClient.incrby("dataingest:count","1")
        redisClient.get("dataingest:count", function(error, result)
        {
          if (error) console.log('Error: '+ error);
          else
          {
            console.log('Name: ' + result);
            redisClient.zadd("dataingest",result,JSON.stringify(appData_ingestInfo));
          }
        });
        NSP.to(room_Name).emit('location.subcribe',JSON.stringify(appData_ingestInfo));
        redisClient.hmset("data_ingest",id,JSON.stringify(appData_ingestInfo));
        redisClient.publish("ingestdata", JSON.stringify(appData_ingestInfo));
      }

    }
    socket.on('disconnect', function()
    {
      console.log('user disconnected');
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
