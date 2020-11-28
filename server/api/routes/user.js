const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const JWT_Key = 'saltAndPepper';

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Mail already exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        name: req.body.name
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        
                        res.status(201).json({
                            message: 'User created'
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            });
        }
    })
   
});

router.post('/login', (req, res, next) =>{
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        
        if (user.length < 1) {
            
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            console.log(result);

            if (err) {
               
                res.status(401).json({
                    message: 'Auth failed'
                })
            } 
            if(!result) {

                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                JWT_Key,
                {
                    expiresIn: '1h'
                }
                )
                console.log(token);
                
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token,
                    userId: user[0]._id
                })
            }
        })
    }) 
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
})

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;  
    console.log(req.body);
console.log(res);

    User.update({_id: id}, {$set: req.body})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
        
    })
});

router.delete('/:userId', (req, res, err) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User was deleted'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.get('/:userId', (req, res, err) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;