const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const auth = require('../auth');

const router = express.Router();

//ROUTES FOR USER REGISTRATION/ SIGNUP
router.post('/register', (req, res, next) => {
    let password = req.body.password;
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            throw new Error('Sorry!! could not hash!');
        }
        User.create({
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            username: req.body.username,
            password: hash

        }).then((user) => {
            let token = jwt.sign({ _id: user._id }, process.env.SECRET);
            res.json({ status: "Signup Successful!", token: token, role: user.role });

        }).catch(next);
    });
});

//ROUTES FOR USER LOGIN
router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user == null) {
                let err = new Error('Sorry! User not found.');
                err.status = 401;
                return next(err);
            }
            else {
                bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Password does not match.');
                            err.status = 401;
                            return next(err);
                        }
                        let token = jwt.sign({ _id: user._id }, process.env.SECRET);
                        res.json({ status: 'Login Successful!', token: token, role: user.role });
                        //console.log("Login Successful!");
                    }).catch(next);
            }
        }).catch(next);
});


//CUSTOMER PROFILE
router.get('/myProfile', auth.verifyUser, (req, res, next) => {
    res.json({
        _id: req.user._id, fullName: req.user.fullName, phone: req.user.phone,
        address: req.user.address, email: req.user.email, username: req.user.username,
        role: req.user.role
    });
});

//CUSTOMER PROFILE UPDATE
router.put('/myProfile', auth.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => {
            res.json(user);

        }).catch(next);
});

module.exports = router;