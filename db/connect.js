const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
    console.log('connection to db successful');
}).catch((err) => console.log('connection to db failed: ',err));