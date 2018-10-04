var divid = 100;
var chatid =1000;
var currEvent = 0;
var avatar= '';
var login= false;
var sessionid = '';
var usrresponse = 1;
var start = 0;
var actionid= 0;
//ws = new WebSocket('ws://localhost:8080');                                        //Defining port for Server.
var nxt=[];

$(document).ready(function(){
    var ctxt = '';	
            $('#login').click(function(){
                if(login===false){
                    document.getElementById('modal-wrapper').style.display='block';
                    $('.sessiontxt').focus();
                }
                else{
                    document.location.reload(true);
                }
            });
	
    $('.btnLogin').click(function(event){
        sessionid = $('.sessiontxt').val();
        if($('.sessiontxt').val()!=''){
            $('.welcometxt').text("Welcome, "+sessionid.charAt(0).toUpperCase() + sessionid.slice(1));
            $("#login").attr("src","img/login.png");
            $('.btnBOT').css('display','inline');
            login =true;
            updateAvatar(sessionid);
        }           
    });	
    
$('.chattxt').keypress(function(event){
        if(event.which === 13){
            event.preventDefault();
            ctxt = $('.chattxt').val();            
            $('#'+createChatDiv('USR')).text(ctxt.charAt(0).toUpperCase() + ctxt.slice(1));
            $(".chatlogs").scrollTop($(".chatlogs").prop('scrollHeight'));
            $('.chattxt').val('');
            chatsend(ctxt);
        }
    });
	
$('a#click-a').click(function(){
        $('.chatbox').toggleClass('chatbox-view');
        $('.chattxt').focus();
    });
    $('#closeTab').on('click', function(){
        $('.closeUrl img').css('display','none');
        $('#urlpane').css('display','none');
        $('.chatbox').toggleClass('chatbox-view');
        $('.chattxt').focus();
    });
    
    $('.chatpane').keypress(function(event){
        if(event.which === 13){
            event.preventDefault();
        }
    });
});

function updateAvatar(uname){
    if(uname==='neha') avatar='img/user2.png'; 
    else avatar='img/user.png';
}

function chatsend(ctxt){    
    send(sessionid+'|CHAT| '+ctxt,function(msg){
        messageAction(msg);
    });

}


// Response from bot Display>
function typeText(divid, typtxt, callback){
    $('#'+divid).typewrite({
        actions: typtxt,
        showCursor: false,
        blinkingCursor: false,
        cursor: '|'
    });
    $('#'+divid).show();
    $(".chatlogs").scrollTop($(".chatlogs").prop('scrollHeight'));
    $('#'+divid).focus();
    $('#'+divid).on('typewriteComplete', function() {
            $(".chatlogs").scrollTop($(".chatlogs").prop('scrollHeight'));
              $('.chattxt').focus();
            if(callback){
                callback();
            }
        });
    $('#'+divid).on('typewriteNewLine', function() {
        $(".chatlogs").scrollTop($(".chatlogs").prop('scrollHeight'));
    });
    $('#'+divid).on('typewriteStarted', function() {
        $(".chatlogs").scrollTop($(".chatlogs").prop('scrollHeight'));
    });        
}

function createChatDiv(divtype){
    var divname = 'div'+divid;
    var chatname = 'chat'+chatid;
    if(divtype==='USR'){
        $(".chatlogs").append("<div id='"+chatname+"' class='chat user'></div>");
        $('#'+chatname).append("<div class='photo'><img src='"+avatar+"'></div>");
        $('#'+chatname).append("<p id='"+divname+"' class='chat-message'></p>");
        divid +=1;
        chatid +=1;
    }
    else{
        $(".chatlogs").append("<div id='"+chatname+"' class='chat bot'></div>");
        $('#'+chatname).append('<div class="photo"><img src="img/bot.png"></div>')
        $('#'+chatname).append("<p id='"+divname+"' class='chat-message'></p>");
        divid +=1;
        chatid +=1;
    }
    //$(".chatpane").append("<div class='dummy'></div>");   
    return divname;
}


//
function processMsg(msg){
    resarry = [];
    msgarr = [];
    if(msg.indexOf('#') != -1){
        resarry.push({delay: 200});
        msgarr = msg.split('#');
        msgarr.forEach(function(itm){
            resarry.push({type: itm + ' '});
            resarry.push({type: '<br>'});
        });
    }else{
        resarry.push({delay: 200},{type: msg});
    }
    return resarry;
}


//Identification of response to proceed to next action
function messageAction(msg){
    msgParts = msg.split('|');
    if(msgParts[0] === 'CHAT'){
        typeText(createChatDiv(1),processMsg(msgParts[1]),function(){
            processNxt();
        });    
    }else if(msgParts[0] === 'BOT'){
        //console.log('>>>> '+msgParts[1]);
          botObj = JSON.parse(msgParts[1]);
          actionid=botObj.next;
            if(botObj.restype === 'T'){
                typeText(createChatDiv(1),processMsg(botObj.reply),function(){
                    processNxt();
                });
            }else if(botObj.restype === 'O'){
                createResponseOpt(botObj.obj);                
            }
            else if(botObj.restype === 'E'){
                exeFunction(botObj.response,function(){
                    send(sessionid+'|BOT|NEXT',function(msg){
                        messageAction(msg);
                    });
                });  
            }
            else if(botObj.restype === 'U'){
                exeFunction(botObj.response,function(){
                    typeText(createChatDiv(200),botObj.url,function(){
                        send(sessionid+'|BOT|'+actionid,function(msg){
                            messageAction(msg);
                        });
                    });                        
                });  
            }
    }else if(msgParts[0]=='CTX'){
        ctx=msgParts[1].split(',');
        var dname = createChatDiv(1);
        createOpt(ctx,function(ihtml){
            $('#'+dname).append('You are interested in :  </br>'+ihtml) ;            
        });
        $('#'+dname).append('</br><input type="button" id="Submit" value="Submit" onclick="returnOpt(ctx);this.disabled=true;">') ;
        $('#'+dname).show();
        $(".chatlogs").scrollTop($(".chatlogs").prop('scrollHeight'));
        
    }else if(msgParts[0]=='URL'){
        typeText(createChatDiv(1),processMsg('Anything else'));
        var url = "http://"+msgParts[1];
        $('.chatbox').toggleClass('chatbox-view');
        load_home(url);  
    }else if(msgParts[0]=='URLW'){
        typeText(createChatDiv(1),processMsg('Anything else'));
        var url = "http://"+msgParts[1];
        window.open(url,'_blank');          
    }	
 }  
 
 function load_home(url) {
     console.log(url);
     document.getElementById("inputpane").innerHTML='<object id="urlpane" class="urlpane" type="text/html" data="'+url+'" ></object>';
     $('.closeUrl img').css('display','inline');
}

function createResponseOpt(optObj){
    var dname = createChatDiv(1);
    $("#"+dname).append(optObj);    
    $("#"+dname).show();
    $(".chatlogs").scrollTop($(".chatlogs").prop('scrollHeight'));    
}

function chkResponse(form){
    createRes(form,function(res){
        send(sessionid+'|BOT|'+actionid+'|'+res,function(msg){
            messageAction(msg);
        });
    });
}

function createRes(form,cb){                                                // Read from inputs concanate them using '/' and send them as response
    var res = [];
    for(i=0;i<form.length-1;i++){
        res.push(form.elements[i].value);
    }    
    res = res.join('/');
    //console.log(res);
    return cb(res);    
}

function exeFunction(functionName,callback){
    eval(functionName);
    callback();
}

function createOpt(opts, cb){                                           // creates context for client HTML
    var htmlStr = '<form>';
 opts.forEach(function(itm){
     htmlStr += '<input type="checkbox" id="'+itm.split('&')[0]+'" >'+itm.split('&')[1]+'</input></br>'
 });
 //console.log(htmlStr);
 return cb(htmlStr);
}

function returnOpt(opts){                                               //returns context options selected
    var ctx=[];
    opts.forEach(function(itm){
        if(document.forms[document.forms.length-1].elements[itm.split('&')[0]].checked){
            ctx.push(itm.split('&')[2]+'&'+encodeURIComponent(itm.split('&')[3]));                  //actiontype and action of selected choice
            //console.log("Encode url "+ encodeURIComponent(itm.split('&')[3]));
        }
    });
    nxt=ctx;
    send(sessionid+'|CTX|'+nxt.shift(),function(msg){
        messageAction(msg);
    });    
}

function getSize(){
    var e= document.getElementById('chq_size');
    var size = e.options[e.selectedIndex].value;
    send(sessionid+'|BOT|'+actionid+'|'+size,function(msg){
        messageAction(msg);
    });
}

function processNxt(){
    if(nxt.length>0){
        send(sessionid+'|CTX|'+nxt.shift(),function(msg){
            messageAction(msg);
        });
    }
}

function send(msg, cb){
    console.log("Opps  "+msg)
    url= 'http://N7561:4000';
    //console.log(url);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, true);                                                 // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-16");
    xmlHttp.send(JSON.stringify({web:msg}));
    xmlHttp.onreadystatechange = function() {                                //Call a function when the state changes.
    if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
        console.log("Response Recieved :: "+ xmlHttp.responseText );
        return cb(xmlHttp.responseText);                                           // Request finished. Do processing here.
        }
    }
    
}
