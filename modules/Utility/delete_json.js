var elasticsearch = require('elasticsearch');
var fs = require('fs');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

deleteIndex();

function deleteIndex() {  
    return client.indices.delete({
        index: 'botdata'
    });
}