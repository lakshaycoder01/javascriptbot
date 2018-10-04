
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var lang ;
var doTranslation = false;

exports.translate = function(msg,cb){
    if(doTranslation){    
        action='https://translation.googleapis.com/language/translate/v2?key=AIzaSyAdof4IVcOX4t34CtVSQvqXA1YhvbC5TWU&target=en&q='+encodeURIComponent(msg);                                     //https request to self signed certificate.
        console.log("Action : "+action);
        var xmlHttp = new XMLHttpRequest();                         
        xmlHttp.open("GET", action, false);                              // true for asynchronous 
        xmlHttp.send(null);
        //console.log(xmlHttp.responseText);
        lang = JSON.parse(xmlHttp.responseText).data.translations[0].detectedSourceLanguage;
        //console.log(JSON.parse(xmlHttp.responseText).data.translations[0].detectedSourceLanguage);
        //console.log(JSON.parse(xmlHttp.responseText).data.translations[0].translatedText.toLowerCase());
        return cb(JSON.parse(xmlHttp.responseText).data.translations[0].translatedText.toLowerCase());
    }
    else{
        return cb(msg);
    }
        
}

exports.response = function (res,cb){        
        if(res.split('|')[0]=== 'CHAT'){
            change(res.split('|')[1],function(res){
                return cb('CHAT|'+res);
            });            
        }else if(res.split('|')[0]=== 'CTX'){
            var response= [];
            var ctx = res.split('|')[1].split(',');                                                             //CTX|ctx1,ctx2
            for(i=0;i<ctx.length;i++){
                change(ctx[i].split('&')[1],function(desc){                                 //ctx1 : cmd&desc&type&action
                    
                    response.push(ctx[i].split('&')[0]+'&'+desc+'&'+ctx[i].split('&')[2]+'&'+ctx[i].split('&')[3])
                })
            }
            response= response.join();
            return cb('CTX|'+response)
        }
        else if(res.split('|')[0]=== 'BOT'){
            var obj = JSON.parse(res.split('|')[1]);
            if(obj.restype=== 'T'){
                change(obj.reply,function(reply){
                    obj.reply=reply;
                    return cb('BOT|'+JSON.stringify(obj));
                })
            }
            else  return cb('BOT|'+JSON.stringify(obj));
        }
                
}


function change(res,cb){
    if(doTranslation){
        action='https://translation.googleapis.com/language/translate/v2?key=AIzaSyAdof4IVcOX4t34CtVSQvqXA1YhvbC5TWU&target='+lang+'&q='+encodeURIComponent(res);  
        console.log("Action : "+action);
        var xmlHttp = new XMLHttpRequest();                         
        xmlHttp.open("GET", action, false);                              // true for asynchronous 
        xmlHttp.send(null);
        //console.log(xmlHttp.responseText);
        return cb(JSON.parse(xmlHttp.responseText).data.translations[0].translatedText);
    }else{
        return cb(res);
    }
    
}
