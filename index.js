var fs = require('fs');
var express = require('express');
var https = require('https');

var key = fs.readFileSync('./certs/file.pem');
var cert = fs.readFileSync('./certs/file.crt')
var https_options = {
    key: key,
    cert: cert
};
var PORT = 8000;
var HOST = '0.0.0.0';
app = express();

app.use(express.static('www'))

server = https.createServer(https_options, app).listen(PORT, HOST);
var io = require('socket.io')(server);
console.log('HTTPS Server listening on %s:%s', HOST, PORT);
require('./clientlogger')(io,true);
require('./clientdata_ingest')(io,true);
