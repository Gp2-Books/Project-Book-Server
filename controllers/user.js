const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../helpers/jwt')

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

}

module.exports = UserController