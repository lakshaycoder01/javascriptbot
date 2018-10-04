//underscore, apparatus, sylvester

var elasticsearch = require('elasticsearch');
var compendium = require('compendium-js');
var natural = require('natural');
var async = require('async');

var elasticClient = new elasticsearch.Client({  
    host: 'localhost:9200', 
    log: 'info'
});

//var indexName = "botdata";
var str='';
var msg='';
//var idxinstancetyp = 'chattxt';

//exports.processInput = function (inStr,cb){
 exports.processInput = function (inStr,cb){    
    if(inStr.length-1  == 0) return cb(null);
    msg=inStr;
    //console.log("\n"+msg);
    
    /*searchhistory(inStr,'chathist',function(result){
        console.log(result.hits.total);
        if(result.hits.total>0){
            hit =result.hits.hits[0]._source;
            var cmd = new Map();
            cmd.set(hit.command,hit.obj);
            return cb(cmd);
        }
        else { 
     */
            var obj = '';
            var mytokens = [];

            var parsetokens = ['VB','VBP','RB','NN','JJ','UH','NNS','NNP','WRB','CD'];
            var parsedtokens = [];

            obj = compendium.analyse(inStr);
            mytokens = obj[0].tokens;

            for(var i=0; i< mytokens.length; i++){
                if(parsetokens.includes(mytokens[i].pos)){
                    parsedtokens.push(mytokens[i].raw);
                }
            }
            //console.log(parsedtokens.toString().replace(/,/g,' '));
            if(parsedtokens.length>0){
                getCommand(parsedtokens,function(results){
                return cb(results);
                });    
            }
            else return cb(null);  
            
        /*}
    });  */
}

function getCommand(processtxt,cb){
    var ngramcnt = 0;
    var ngrams = natural.NGrams;
    var ngramcoll = [];
    
    ngramcnt = processtxt.length;
    //console.log('N Gram Cnt > '+ngramcnt);
    for(var i=ngramcnt; i > 0 ; i--){
        ngramcoll = ngramcoll.concat(ngrams.ngrams(processtxt,i));
    }
    console.log('Ngrams Array : '+ngramcoll.join(' - '));
    async.map(ngramcoll, search, function(err, result){
        
            console.log(result.length);
             
            processOutput(ngramcoll[0],result,function(cmdMap){                 // Finds The Exact Match
                //console.log(cmdMap);    
                if(cmdMap.size==1){
                        /*var myCmd = cmdMap.keys().next().value ;
                        getIdFromHist(myCmd,function(obj){
                                console.log('ID is : '+obj);
                                updatehist(msg,obj);
                            });*/
                        console.log(cmdMap);
                        return cb(cmdMap);                        
                    }                        
                    else{                                                                                                            //If no exact match return all unique commands
                        getUnique(result,function(cmdMap){
                            return cb(cmdMap);                
                        });                        
                    }                   
                });
    });
}

function search(s,cb){
    str = s.toString().replace(/,/g, ' ');
    //console.log("NGram > > "+str);
    searchmaster(str, 'chattxt',function(result){
        //console.log(result);    
        //sresult=result;
           return cb(null,result.hits.hits);
    });          
}


function processOutput(s,resultset,cb){ 
    str = s.toString().replace(/,/g, ' ');
    var cmd = new Map();
    for(var i=0;i<resultset.length;i++){
        cmdset=resultset[0];  
        for(j=0;j<cmdset.length;j++){
            if(str===cmdset[j]._source.text)
                cmd.set(cmdset[j]._source.command,cmdset[j]._source);            
        }
    }
    //console.log("\n\n");
    //console.log(cmd)
    //console.log("\n\n");
    return cb(cmd);
 }
 

function getUnique(resultset,cb){
    var cmd = new Map();
    for(var i=0;i<resultset.length;i++){
        cmdset=resultset[i];  
        for(j=0;j<cmdset.length;j++){                      
            cmd.set(cmdset[j]._source.command,cmdset[j]._source);            
        }        
    } 
    return cb(cmd);             
}


function searchmaster(s, idxinstancetyp,cb) {
  return elasticClient.search({
        index: 'botdata',
        type: idxinstancetyp,
        body: {
            query: {
                match:{
                    text: {
                        query : s,
                        //type: 'phrase'
                    }
                }
            }
        }
    }).then(function (resp) {
        return cb(resp);
    }, function (err) {
        console.log(err.message);
    });
}

function updatehist(rawtxt, id){    
    elasticClient.update({
        index: 'bothist',
        type: 'chathist',
        id: id,
        body: {
            script: {
               lang: 'painless',
               inline: 'ctx._source.raw_text.add(params.txt)',
               params: {
                 txt: rawtxt
               }
            }        
        }
    },function(error,response){
        //console.log(error);
        console.log("Response : "+JSON.stringify(response));
    });
}
 
function getIdFromHist(cmd,cb){
    var id = '';
    return elasticClient.search({
        index: 'bothist',
        type: 'chathist',
        body: {
            query: {
                "match": {
                    "command": {
                        query: cmd
                    }
                }
            }
        }
    }).then(function (resp) {
        //console.log(JSON.stringify(resp));
        id = resp.hits.hits[0]._id;
        return cb(id);
    }, function (err) {
        console.log(err.message);
    });
}

function searchhistory(s, idxinstancetyp,cb){
   var res = '';
   return elasticClient.search({
        "index": 'bothist',
        "body": {
            "query": {
               "match_phrase": {
                    "raw_text": {
                        "query": s,
                    }
                }
            }
		}//Body
    }).then(function (resp) {
        return cb(resp);
    }, function (err) {
        console.log(err.message);
    });
}


/*
getIdFromHist('MHBOT',function(obj){
    console.log('ID is   '+obj);
    updatehist(str,obj);
});



processInput('what is my acc bal', function(r){
    console.log("OUTPUT :::::::::::")
    console.log(r);
});


*/
