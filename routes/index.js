const router = require('express').Router()
const { UserController } = require('../controllers')
const authentication = require('../middlewares/authentication')


router.post('/register', UserController.register)
router.post('/login', UserController.login)
// router.get('/sample', authentication, UserController.sample)

module.exports = router