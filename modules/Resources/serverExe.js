
exports.execute = function(action,cb){
    switch(action){
        case 'DATE':   var date = new Date();  
                               var str = "Today's date is: ";  
                               str += (date.getMonth() + 1) + "/";  
                               str += date.getDate() + "/";  
                               str += date.getFullYear(); 
                              return cb (str);
                              break;
        case 'DAY':    var date = new Date();
                              var str = "Its : "+date.getUTCDay();
                              return cb(str);
                              break;
        case 'TIME':  var date =new Date();
                              var str= "Right now the Time is :: "
                              var h = date.getHours();
                              var m = date.getMinutes();
                              var s = date.getSeconds();
                              return cb(str+h+ ":" + m + ":" + s);
                              break;       
        default :
            return cb("Please try again with something else");
            break;
    }
}