const router = require('express').Router()
const { UserController, BookController } = require('../controllers')
const authentication = require('../middlewares/authentication')


router.post('/register', UserController.register)
router.post('/login', UserController.login)
// router.get('/sample', authentication, UserController.sample)
router.use(authentication)
router.get('/book', BookController.book)

module.exports = router