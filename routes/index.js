const express = require('express');
const router = express.Router();
const {registerUser, makePayment, confirmPayment, getTransactions} = require('../controllers');
const {authentication, authorization} = require('../middlewares');


router.post('/register', registerUser);
router.post('/complete',authentication, authorization,  makePayment);
router.post('/confirm', confirmPayment);
router.get('/transactions', getTransactions)

module.exports = router;