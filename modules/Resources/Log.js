const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var LogSchema = new Schema({
    username: String,
    date: String,
    time: String,
    input: String,
    cmds: [ { } ]
});
module.exports = mongoose.model('Log', LogSchema);