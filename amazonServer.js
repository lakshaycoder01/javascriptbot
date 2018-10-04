
const chatbot = require('./modules/Main/chatbot');

var context = {session : 'CHAT', actionId:'111'};
var user= 'user1';
var loginAttempt = 0;

exports.getResponse = function(type,payload,cb){
    switch(type){
        case 'SessionEndedRequest' : 
            createResponse("CHAT|I didn't get you there'", function(res){
                console.log("Response Session :: "+JSON.stringify(res.response.outputSpeech.text));console.log();console.log(":::::::::::NEXT MESSAGE::::::::::::::");console.log();
                return cb(res);
            });
            break;
        case 'IntentRequest' :            
            processPayload(payload,function(res){                
                console.log("Response Intent :: "+res);
                createResponse(res,function(response){
                    return cb(response);        
                });   
            });
            break;  
        case 'LaunchRequest':
           if(payload.session.user.accessToken == undefined){
               loginAttempt = 0;
            return cb({
                "version": "1.0",              
                "response": {              
                  "outputSpeech": {              
                    "type": "PlainText",              
                    "text": " Please use the companion app to authenticate on Amazon to start using this skill"              
                  },              
                  "card": {              
                    "type": "LinkAccount"              
                  },              
                  "shouldEndSession": true              
                },              
                "sessionAttributes": {}              
            })}else {
            if (loginAttempt === 0){
                    createResponse("BOT|"+JSON.stringify({restype:'T', reply:"Please Provide OTP", next:1000}), function(res){
                    console.log("Response Session :: "+JSON.stringify(res.response.outputSpeech.text));
                    loginAttempt++; 
                    return cb(res);
                });
            }else {
                // Check for Time Stamp
                    createResponse("BOT|"+JSON.stringify({restype:'T', reply:"Hey, How can I assist you ?", next:111}), function(res){
                    console.log("Response Session :: "+JSON.stringify(res.response.outputSpeech.text));
                    return cb(res);
                });
            }
        }
    }
}

function createResponse(msg,cb){    
    context.session=msg.split('|')[0];    
    if (msg.split('|')[0] == 'CHAT'){
        var endSession = true;
        msg = msg.split('|')[1];
    }
    else{
        var endSession = false;
        var obj = JSON.parse(msg.split('|')[1]);
        context.actionId=obj.next;
        
        msg= obj.reply;
    }
    
    var response = {
           "version": "1.0",
           "response": {
               "outputSpeech": {
                   "type": "PlainText",
                   "text": msg
               },
               "shouldEndSession": endSession
           }
       };                                      
    return cb(response);    
}

function processPayload(payload,cb){
    var session= context.session;
    var message=payload.request.intent.slots;
    console.log("Message From Client : : " +session+'|'+context.actionId+'|'+message.Message.value);
    if(session === 'CHAT'){
        chatbot.processMsg(user+'|'+session+'|'+message.Message.value,'Alexa',function(response){           //Msg to BOT Engine
        return cb(response);
        });
    }else{chatbot.processMsg(user+'|'+session+'|'+context.actionId+'|'+message.Message.value,'Alexa',function(response){           //Msg to BOT Engine
            return cb(response);
        });
    }
}