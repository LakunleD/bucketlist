const express = require('express');
const bcrypt = require('bcrypt');

const tokenManagement = require('../library/token');

const User = require('../models/user');

const router = express.Router();


router.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.findOne({username})
        .then(user => {
            if (user === null) {
                return res.status(401).send({message: "Username/Password is incorrect"});
            }
            else {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        return res.status(401).send({message: "Username/Password is incorrect"});
                    }
                    if (result) {
                        user['password'] = undefined;
                        user['__v'] = undefined;
                        tokenManagement.createToken(user._id)
                            .then(token => {
                                res.send({token, user});
                            })
                            .catch(err => {
                                console.log(err);
                                return res.status(500).send(err);
                            });
                    }
                    else {
                        return res.status(401).send({message: "Username/Password is incorrect"});
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send(err);
        });
});



module.exports = router;
