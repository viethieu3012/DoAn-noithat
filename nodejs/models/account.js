const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Demo-Webdev-DoAn');

const Schema = mongoose.Schema;


const AccountSchema = new Schema({
    username: String,
    password: String,
},{
    collection: 'Account'
});

const AccountModel = mongoose.model('account',AccountSchema)
module.exports = AccountModel