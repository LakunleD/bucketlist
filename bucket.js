const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const users = require('./routes/users');
const auth = require('./routes/auth');
const bucketlist= require('./routes/bucketlist');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bucketlists', bucketlist);


mongoose
    .connect(
        process.env.MONGO_URI,
        {useNewUrlParser: true}
    )
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}...`));
    })

    .catch(err => {
        console.log(err);
        throw err;
    });
