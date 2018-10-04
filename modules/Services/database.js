const Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost/BOT', {  useMongoClient: true});
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('Connection with BOT mongo database succeeded.');
});

exports.db = db;