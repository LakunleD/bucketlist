const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

router.post('/register', (req, res) => {
    let {username, password} = req.body;
    let data = {username};

    let salt = bcrypt.genSaltSync(11);
    data.password = bcrypt.hashSync(password, salt);

    User.create(data)
        .then(user => {
            res.send({message: "user created", user});
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

module.exports = router;