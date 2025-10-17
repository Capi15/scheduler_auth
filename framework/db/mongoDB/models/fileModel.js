'use strict';
//database schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileSchema = new Schema({                     //File will represent the profile picture and other documents
    hidden_name: {type: String, required: true},
    real_name: {type: String, required: true},
    insert_date: {type: String, required: true},
    extension: {type: String, required: true},
    active: {type: Boolean, required: true}
},{collection:'files'});
const File = mongoose.model("File", fileSchema);
module.exports = File;