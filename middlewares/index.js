require('dotenv').config();
const jwt = require('jsonwebtoken');
const models = require('../models');



const authentication = async(req,res,next) => {
    try{
        const {authorization} = req.headers;
        // console.log(authorization);
    if(!authorization) throw new Error('unauthorized access');

    const splitToken = authorization.split(" ");
    jwt.verify(splitToken[1], process.env.JWT_SECRET_KEY, (error, decoded) =>{
        if(error) throw new Error(error);
        req.params.hidden = decoded.email;
        next()
    })

    }catch(error){
        res.status(401).json({
            status: false,
            message: error.message
        })
    }
}


const authorization = async(req,res,next) => {
    try{
        const {hidden} = req.params;
    if(!hidden) throw new Error('unauthorized access');
    const hiddenData = await models.User.findOne({where: {email: hidden}});
    if(hiddenData == null) throw new Error('unauthorized access');
    req.params.user_id = hiddenData.dataValues.user_id;
    next()
    }catch(error){
        res.status(401).json({
            status: false,
            message: error.message
        })
    }
}


module.exports = {
    authentication,
    authorization
}