 

const chat = require('./chatProcess');
const bot = require('./botProcess');
const translate = require ('./translate')
const ctxmgt = require('./ctxManagement');

exports.processMsg = function (msg,channel,cb){
    var msgparts  = msg.split('|');
    var sessionid =msgparts[0].toLowerCase();                  //user_id.
    //console.log("\nSession id:" +sessionid + "Msgparts" + msgparts[0] + "" + msgparts[1] + "" +msgparts[2] );
    
    
 try{   
    if(msgparts[1] === 'CHAT'){
        /*if(channel === 'Mobile' || channel === 'Web'){
        translate.translate(msgparts[2].toLowerCase(),function(msg){
            chat.processmsg(msg,sessionid,channel,function(res){                
                    translate.response(res, function(response){
	console.log("Response to Web Client :: "+response+'|'+sessionid);  
                        return cb(response);
                    });
                })                     
            });
        }else{*/
            chat.processmsg(msgparts[2].toLowerCase(),sessionid,channel,function(res){
                return cb(res);
            });
        //}         
    }else if(msgparts[1] === 'BOT'){
        translate.translate(msgparts[3].toLowerCase(),function(msg){
            bot.processmsg(parseInt(msgparts[2]),msg,sessionid,channel,function(res){               // actionid, user res , userid, channel
                if(channel === 'Mobile' || channel === 'Web'){
                    translate.response(res, function(response){
                            console.log("Response to Web Client :: "+sessionid+" :: "+response);  
                        return cb(response);
                    });
                }
                else return cb(res);               
            });            
        })
        
    }else if(msgparts[1] ==='CTX'){
       ctxmgt.processCtx(msgparts[2],sessionid,channel,function(res){          
          if(channel === 'Mobile' || channel === 'Web'){
              translate.response(res, function(response){
	console.log("Response to Web Client :: "+sessionid+" :: "+response);  
                  return cb(response);
              });
          }
          else return cb(res);
       });       
    }
 }catch (e){
     console.log(sessionid+"  Error in identifying text context  ::: "+e); }
}

