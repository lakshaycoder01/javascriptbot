//const BOTDB = require('./BOTKDB.js');


const process = require('../Resources/process');
const srvExe = require ('../Resources/serverExe');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var id = 'anil';

module.exports =
{
    execute: function(actType,action,id,channel,cb) {
        
        switch(actType){
            
            case 'P':
                 process.processreq(parseInt(action),channel,function(response){
                    return cb('BOT|'+JSON.stringify(response));
                });
                break;
                
            case 'C':                   
                    action='http://'+action+'/'+id;                                      //https request to self signed certificate.
                    console.log("Action : "+action);
                    var xmlHttp = new XMLHttpRequest();                         
                    xmlHttp.open("GET", action, false);                              // true for asynchronous 
                    xmlHttp.send(null);
                    return cb('CHAT|'+xmlHttp.responseText);                    

            case 'T':
                return cb('CHAT| '+action);
            
            case 'SX':
                srvExe.execute(action,function(res){
                    return cb('CHAT|'+res);
                });
                break;
                
            case 'U':
                return cb('URL|Cannot open browser. Sorry !!');
            case 'UW':
                //return cb("CHAT|Cannot open browser. Sorry !!");
                return cb('URLW|'+action);
            case 'UP':
                return cb("CHAT|CORE server is yet not integreted. Please !! try something else.")
                //return cb('URLP|'+action);
        }        
  }
}

