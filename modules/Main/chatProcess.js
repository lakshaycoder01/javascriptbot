
const log = require ('../Resources/Log')
const servRep = require('../Services/servicesRep.js');
const txtOrcl = require('./txtoracle');
const ctxmgt = require('./ctxManagement');
const bot = require('./botProcess');


exports.processmsg= function(msg,sessionid,channel,cb){

    txtOrcl.processInput(msg,function(command){
             //updateLog(msg,sessionid,cmd);
            //console.log("ChatBOT");
            //console.log("\n Starting of process message");
            //console.log(command);  
            if(command.size>1){
                    ctxmgt.options(command,channel,function(res){
                        return cb(res);
                    });
            }else if (command.size!=0){
                var myCmd = command.keys().next().value ;
                servRep.execute(command.get(myCmd).actiontyp,command.get(myCmd).action,sessionid,channel,function(res){
                    //console.log("Process Response :: "+res);
                    return cb(res);
                });                    
            }
            else return cb("CHAT| Can't help you with this.");              
     });    
}

function updateLog(msg,sessionid,commands){
    var cmd=[];
    var mapNxt = commands.values();
    for(i=0;i<commands.size;i++){
        cmd.push(mapNxt.next().value);
    }        
     //console.log(cmd);
     var  newEntry = new log({
         username: sessionid,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         input: msg, 
         cmds: cmd 
     });
     newEntry.save(function(error) {
         if (error)    console.error(error); 
         else console.log('Log Updated');
      });
      
}