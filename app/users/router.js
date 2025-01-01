const express = require('express');
const router = express.Router();
const { viewSignin, actionSignin, actionLogout, viewRegister, actionRegister, index, viewCreate, actionCreate } = require('./controller')

/* GET home page. */
router.get('/', viewSignin);
router.post('/', actionSignin);
router.get('/register', viewRegister);
router.post('/register', actionRegister);
router.get('/logout', actionLogout);

//routing mot
router.get('/mot',index);
router.get('/mot/create', viewCreate);
router.post('/mot/create', actionCreate);



module.exports = router;