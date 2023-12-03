require('dotenv').config();
const models = require('../models');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { startPayment, completePayment } = require('../services');


const registerUser = async (req, res) => {
    try {
        const { email, username, phone, age } = req.body;
        if (!email || !username || !phone || !age) throw new Error('email, username and phone are required');

        // const checkIfUserExist = await models.User.findOne({where: {email}});
        // if(checkIfUserExist != null) throw new Error('user already exists');

        await models.User.create({ ...req.body, user_id: uuidv4() });

        const payload = {
            _id: uuidv4(),
            email
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.status(201).json({
            status: true,
            message: 'user registration successful',
            token: token
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}


const confirmPayment = async (req, res) => {
    try {
        const { adminkey } = req.headers;
        if(adminkey != process.env.ADMIN_KEY) throw new Error('unauthorized request');

        const { paymentCode } = req.body;
        if (!paymentCode) throw new Error('payment code is required');

        const checkCode = await models.Payment.findOne({ where: { payment_reference: paymentCode } });
        if (!checkCode) throw new Error('invalid payment code');

        res.status(200).json({
            status: true,
            message: "valid payment code"
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}


const getTransactions = async (req, res) => {
    try {
        const { adminkey } = req.headers

        if (adminkey != process.env.ADMIN_KEY) throw new Error('unauthorized request');

        const Transactions = await models.Transaction.findAll({
            attributes: ['amount', 'transaction_id', 'createdAt']
        });

        res.status(200).json({
            status: true,
            data: Transactions
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
const makePayment = async (req, res) => {
    const { user_id } = req.params;
    const { reference } = req.body;
    try {
        if (!user_id || !reference) throw new Error('unauthorized request');

        const checkIfReferenceExist = await models.Payment.findOne({ where: { payment_reference: reference } });
        if (checkIfReferenceExist != null) throw new Error('invalid Transaction reference');

        const completeTransaction = await completePayment(reference);
        if (completeTransaction.data.data.status != "success") throw new Error('invalid transaction');

        const createPayment = {
            payment_id: uuidv4(),
            user_id,
            payment_reference: reference
        };
        await models.Payment.create(createPayment);

        const amountInNaira = parseFloat(completeTransaction.data.data.amount) / 100;
        const createTransaction = {
            transaction_id: uuidv4(),
            user_id,
            amount: amountInNaira
        };
        await models.Transaction.create(createTransaction);
                              
        res.status(201).json({
            status: true,
            message: "payment successful"
        });

    } catch (error) {
            res.status(500).json({
            status: false,
            message: error.message
        })
    }
};

module.exports = {
    registerUser,
    makePayment,
    confirmPayment,
    getTransactions
}