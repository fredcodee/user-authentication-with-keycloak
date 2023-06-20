const router = require('express').Router();
const userController = require('../controllers/usercontroller'); 



router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/logout', userController.logoutUser)
router.post('/verifytoken', userController.verifytoken)
router.post('/refreshtoken', userController.refreshUserToken)


//export router
module.exports = router;