const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/register',UserController.userRegistration);
router.post('/login',UserController.userLogin);

//protected password
router.post('/changepassword',UserController.changeUserPassword);


module.exports = router;