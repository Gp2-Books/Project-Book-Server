const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTIDGOOGLE);

class UserController {
    static register (req, res, next) {
        let user = {
            email: req.body.email,
            password: req.body.password
        }

        User.create(user)
        .then(result => {
            res.status(201).json({email: result.email, id: result.id})
        })
        .catch(err => {
            next(err)
        })
    }

    static login (req, res, next) {
        User.findOne({
            where : {
                email: req.body.email
            }
        })
        .then(result => {
            if(!result) {
                throw {
                    status: 400,
                    message: 'Invalid email/password'
                }
            }
            else {
                if (bcrypt.compareSync(req.body.password, result.password)) {
                    const access_token = generateToken({id : result.id, email: result.email})
                    res.status(200).json({access_token})
                }
                else {
                    throw {
                        status: 400,
                        message: 'Invalid email/password'
                    }
                }
            }
        })
        .catch(err => {
            next(err)
        })
    }

    // static sample(req, res, next) {
    //     console.log('masuk sample')
    //     User.findAll()
    //     .then(result => {
    //         res.status(200).json('OK')
    //     })
    //     .catch(err => {
    //         res.status(404).json(err)
    //     })
    // }

    static googleLogin(req, res, next){
        let payload
        client.verifyIdToken({
            idToken: req.body.googleToken,
            audience: process.env.CLIENTIDGOOGLE
        })
        .then(ticket => {
            payload = ticket.getPayload()
            console.log(payload)
            return User.findOne({
                where: {
                    email: payload.email
                }
            })
        })
        .then(data => {
            if(data){
                return data
            } else {
                return User.create({
                    email: payload.email,
                    password: process.env.PASSWORD
                })
            }
        })
        .then(user => {
            const access_token = generateToken({id: user.id, email: user.email})
            res.status(200).json({access_token})
        })
        .catch(err => {
            next(err)
        })
    }

}

module.exports = UserController