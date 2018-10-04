var elasticsearch = require('elasticsearch');
var fs = require('fs');
var pubs = JSON.parse(fs.readFileSync('./modules/Utility/bothist.json')); // name of my first file to parse

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

//deleteIndex();
/*
client.indices.create({
    index: "bothist",
    body: {
    "mappings": {
        "chathist": {
            "properties": {
                "command": {"type": "text"},
                "raw_text": {"type": "keyword"}
            }
        }
    }

    }
}, function (err, resp, respcode) {
    console.log(err, resp, respcode);
});

*/
for (var i = 0; i < pubs.length; i++ ) {
  client.create({
    "index": "bothist", // name your index
    type: "chathist",//"chattxt", //"chathist", // describe the data thats getting created
    //mappings: "doc",
    id: i, // increment ID every iteration - I already sorted mine but not a requirement
    body: pubs[i] // *** THIS ASSUMES YOUR DATA FILE IS FORMATTED LIKE SO: [{prop: val, prop2: val2}, {prop:...}, {prop:...}] - I converted mine from a CSV so pubs[i] is the current object {prop:..., prop2:...}
  }, function(error, response) {
    if (error) {
      console.error(error);
      return;
    }
    else {
    console.log(response);  //  I don't recommend this but I like having my console flooded with stuff.  It looks cool.  Like I'm compiling a kernel really fast.
    }
  });
}


function deleteIndex() {  
    return client.indices.delete({
        index: "bothist"
    });
}

/*

*/