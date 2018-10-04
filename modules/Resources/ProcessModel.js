const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var BOTKDBSchema = new Schema({
    resid:{ type: Number},
    response: {}
});
module.exports = mongoose.model('ProcessCtrl', BOTKDBSchema,'processes');