const mongoose = require('mongoose');
const { mongodb } = require('../config.json');	

module.exports = async () =>{
    mongoose.set('strictQuery', true);
    return await mongoose.connect(mongodb, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Connected to MongoDB')
            return true;
        }).catch((err) => {
            console.log('Unable to connect to MongoDB Database.\nError: ' + err)
            return false;
        })
}