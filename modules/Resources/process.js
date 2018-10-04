const db = require('../Services/processDB').db;
const BOTKDB= require('../Resources/ProcessModel');

var cache =[];

try {
    function processCache(){
    BOTKDB.find(function(error,botObj){
        if (error)   console.error(error);
        botObj.forEach(function(val){
            cache[val.resid]=val.response;
        })
    });
    }
}catch(e){
    console.error ("Error :: While fetching data into cache "+e);
}

 exports.processreq = function (actionid,channel, cb){
        console.log("Action Id ::: "+ channel +' - '+actionid);
        var botObj=cache[actionid];
        return cb(botObj[channel]);
}

processCache();

/*
cache = new Map();

try {
    function processCache(){
    BOTKDB.find(function(error,botObj){
        if (error)   console.error(error);
        botObj.forEach(function(val){
            cache.set(val.resid,val.response);
        })
    });
    }
}catch(e){
    console.error ("Error :: While fetching data into cache "+e);
}
*/


/*
setTimeout(print,10000);


function print(){
    processreq(302,'Alexa',function(result){
        console.log(result);
    })
}




 processreq = function (actionid,channel, cb){
        //console.log("Action Id ::: "+ channel);
        getBOTdata(actionid,function(botObj){
                return cb(botObj.response[channel]);
        });
}

getBOTdata(201,function(obj){
    console.log("Object :: ");
    console.log(obj);
})
*/