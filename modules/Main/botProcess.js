
const servRep = require('../Services/servicesRep.js');
const process = require('../Resources/process');
const chat = require('./chatProcess');

exports.processmsg= function (actionid,msg,sessionid,channel,cb){
    if(actionid === 111){											//Voice Response 
       chat.processmsg(msg,sessionid,channel,function(res){
           console.log("BOT >>> CHAT "+actionid);
           return cb(res);
       });
    }
    else {
        process.processreq(actionid,channel,function(response){
            switch(response.restype){
                case 'T' : return cb('BOT|'+JSON.stringify(response));
                                break;
                case 'U' : servRep.execute('C',response.url,sessionid+'/'+msg.toLowerCase(),channel,function(res){
                                console.log(sessionid+" : Bank Response : "+res);
                                    if(res.split('|')[1] === 'True'){               // next process to be carried out
                                        process.processreq(response.next ,channel,function(response){     
                                            return cb('BOT|'+JSON.stringify(response));                                         
                                        })                                        
                                    }
                                    else {
                                        return cb('CHAT|'+res.split('|')[1]);
                                    }
                                })
                    break;
                case 'O' : return cb('BOT|'+JSON.stringify(response));
                    break;
                default : return cb('CHAT| Sorry. Process is out off service. ');
                    break;
            }
        });
    }
}
