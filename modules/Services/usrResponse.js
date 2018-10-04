
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var service = require("./servicesRep");

exports.processRes = function(sessionid,value,id,cb){
    switch(id){
        case '221': url="https://localhost:3000/Account_Enquery/CHQREQ/"+sessionid+"/"+value;
                            var xhttp = new XMLHttpRequest();
                            xhttp.open("GET",url , false);
                            xhttp.send(null);
                            var response = xhttp.responseText;
                            console.log(response);
                            return cb('CHAT| '+response);
                            break;
         default: return cb("CHAT| Incorrect input.");
    }
}