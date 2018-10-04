const Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost/ProcessCtrl', {  useMongoClient: true});
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('Connection with Process Control mongo database succeeded.');
});

exports.db = db;