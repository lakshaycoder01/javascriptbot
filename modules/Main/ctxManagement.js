
const servRep = require('../Services/servicesRep');

exports.options= function (cmdset,channel,cb){
    
    var cmd = cmdset.keys() ;
    var res=[];
    
    if(channel == 'Alexa' || channel == 'Google'){
        for(i=0;i<cmdset.size;i++){
            myCmd=cmd.next().value;
            res.push(cmdset.get(myCmd).desc);
        }
        res=res.join(' or ');
        res = 'You are interested in, '+res;
        return cb('BOT|'+JSON.stringify({restype:'T', reply:res, next:111}));
    }
    else{    
        myCmd=cmd.next().value;
       do{        
           res.push( myCmd+'&'+cmdset.get(myCmd).desc+'&'+cmdset.get(myCmd).actiontyp+'&'+cmdset.get(myCmd).action);
           myCmd=cmd.next().value;
        } while(myCmd != null);
        res=res.join();
        return cb('CTX|'+res);
    }
}

exports.processCtx = function(itm,sessionid,channel,cb){
    servRep.execute( itm.split('&')[0],decodeURIComponent(itm.split('&')[1]),sessionid,channel,function(res){
        return cb(res); 
    });           
}