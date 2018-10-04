
function extract(msg){

    if(msg.match(/send\s*(\d*)\sto\s*(\w*)/)){
        var hits =msg.match(/send\s*(\w*)\sto\s*(\w*)/);
        console.log(hits[2]+'/'+hits[1]);
    }

    if(msg.match(/send\s*(\w*)\s\s*(\d*)/)!= null){
        var hits =msg.match(/send\s*(\w*)\s*(\w*)/);
        console.log(hits[1]+'/'+hits[2]);
    }

    if(msg.match(/transfer\s*(\d*)\sto\s*(\w*)/)){
        var hits =msg.match(/send\s*(\w*)\sto\s*(\w*)/);
        console.log(hits[2]+'/'+hits[1]);
    }

    if(msg.match(/transfer\s*(\w*)\s\s*(\d*)/)){
        var hits =msg.match(/transfer\s*(\w*)\s*(\w*)/);
        console.log(hits[1]+'/'+hits[2]);
    }
}

extract ('send 5000 to ankit');