
function upload(command,output,cb){
    
    
    switch(command){
        case 'ACSUMENQ':
                        obj= JSON.parse(output);
                        output='Account Summary ::: </br></br>';
                        for (key in obj) {
                                if (obj.hasOwnProperty(key)){
                                    output= output+key+'   ::   '+obj[key]+' </br>';
                                }
                            }
                        return cb(output);
                        break;
        case 'DEPSUM':
                        obj= JSON.parse(output);
                        output='Deposit Summary ::: </br></br>';
                        for(i=0;i<obj.length;i++){
                            console.log(obj[i]);
                        for (key in obj[i]) {
                                if (obj[i].hasOwnProperty(key)){
                                    output= output+key+'   ::   '+obj[i][key]+' </br>';
                                }
                            }
                            output=output+'</br></br>';
                        }
                        return cb(output);
                        break;
        }

}
