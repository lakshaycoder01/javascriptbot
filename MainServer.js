'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";                 //Allow to respond https call over the CORS network.
const Hapi = require('hapi');
const Good = require('good');
const google = require ('./googleServer');
const amazon = require ('./amazonServer');
const chatbot = require('./modules/Main/chatbot');

var Fs = require('fs');
/*
const tls = {
    key: Fs.readFileSync('test-key.pem'),
    cert: Fs.readFileSync('test.cert')
   };*/

try{
    const server = new Hapi.Server();
    server.connection({ 
        port:4000, host: 'N7561', //tls,
        routes: { cors: true,
	timeout : {
                        server: 120000,
                        socket: false
                    }
                }
        });

server.route({
  method: 'POST',
  path: '/',
  handler: function (request, reply) {
      console.log('\n\n');    console.log(":::::::::::::::::::::Next Message:::::::::::::::::::::::::::");  console.log();
      console.log(request.payload.queryResult);
      getResponse(request.payload,function(res){
         reply(res);
     });
 }
});

function getResponse(payload,cb){
    if(payload.mobile){
        console.log("Message From Mobile Client : : " + payload.mobile);
        chatbot.processMsg(payload.mobile,'Mobile',function(res){
        console.log("Response to Mobile Client : : "+res);        
            return cb([{message:res}]);        
        });
    }
    else if(payload.web){
        console.log("Message From Web Client : : " + payload.web);
        chatbot.processMsg(payload.web,'Web',function(response){
        //console.log("Response to Web Client : : "+response);        
            return cb(response);        
        });        
    }
	else if(payload.request){
        var requestType = payload.request.type;
        amazon.getResponse(requestType,payload,function(response){
            return cb(response);
        });
    }
    else if(payload.queryResult){
        //console.log(payload.queryResult);
        google.getResponse(payload.queryResult,function(res){
            return cb(res);
        }) 
    } 
}

server.start(function (err) {
  if (err) {
    throw err
	} 
  console.log(`Server listening at: ${server.info.uri}`);
})

}catch (e){
    console.log("Server Error ::: " + e);}