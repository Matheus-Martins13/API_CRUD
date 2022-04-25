require('dotenv').config();
const mongoose = require('mongoose');

exports.connect =  () => {
    mongoose.connect(process.env.CONNECTIONSTRING);
}
