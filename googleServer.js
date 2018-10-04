

const chatbot = require('./modules/Main/chatbot');

var context = {session : 'CHAT'};
var user= 'user1';
var actionid;

exports.getResponse = function(request,cb){
    console.log("Starting Google Home...")
    switch(request.action){        
        case 'input.welcome':
            console.log("i'm here...")
            return cb({
                fulfillmentText: "Hi from Bank Bot.",
                source: "iBOT"
              });
         break;
       case 'reply.user': 
                console.log("Message From Client : : " +context.session+'|'+request.parameters.msg);
                chatbot.processMsg(user+'|'+context.session+'|'+request.parameters.msg,'Google',function(res){
                    context.session=res.split('|')[0];
                     console.log("Response to Client : : "+res); 
                     if(res.split('|')[0] === 'CHAT')
                         res = res.split('|')[1];
                     else {
                         var obj = JSON.parse(res.split('|')[1]);
                         res= obj.reply;
                         actionid= obj.next;
                     }
                     return cb({
                            fulfillmentText: res,
                            source: "iBOT"                        
                          });        
                });
          break;
   }
}