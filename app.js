const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

dotenv.config({path: './config.env'});
require('./db/connect');
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(require('./routers/users'));
app.use(require('./routers/code'));
    
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});