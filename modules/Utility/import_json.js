var elasticsearch = require('elasticsearch');
var fs = require('fs');
var pubs = JSON.parse(fs.readFileSync('./botBrain.json')); // name of my first file to parse

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

for (var i = 0; i < pubs.length; i++ ) {
  client.create({
    index: 'botdata', // name your index
    type: 'chattxt', // describe the data thats getting created
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
