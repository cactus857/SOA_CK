const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

//-------------------------------------------//
const router = express.Router();

//-------------Views Routes-----------------//
router.use(viewsController.alerts);

router.get('/', authController.isLogin, viewsController.getOverview);
router.get('/tour/:slug', authController.isLogin, viewsController.getTour);
router.get('/signup', viewsController.getSignupForm);
router.get('/resetPass', viewsController.getResetPassForm);
router.get('/login', viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

//-----------------------------------------//
module.exports = router;