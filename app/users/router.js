const express = require('express');
const router = express.Router();
const { viewSignin, actionSignin, actionLogout, viewRegister, actionRegister, index, viewCreate, actionCreate,  } = require('./controller')
const {isLoginAdmin} =require('../middleware/auth');


/* GET home page. */
router.get('/', viewSignin);
router.post('/', actionSignin);
router.get('/register', viewRegister);
router.post('/register', actionRegister);
// router.post('/mot/delete/:id', isLoginAdmin,);
router.get('/logout', isLoginAdmin,actionLogout);

//routing mot
router.get('/mot',isLoginAdmin,index);
router.get('/mot/create',isLoginAdmin,viewCreate);
router.post('/mot/create',isLoginAdmin, actionCreate);



module.exports = router;