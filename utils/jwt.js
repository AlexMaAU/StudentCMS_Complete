/**
 * JWT也有三种写法：
 * 
 */

//管理token的签发和验证
const jwt = require('jsonwebtoken')

const {JWT_KEY} = process.env

if(!JWT_KEY) {  //如果token不存在
    throw error
}

const generateToken = (payload)=>{
    return jwt.sign(payload, JWT_KEY, {expiresIn: '1d'})
}

const validateToken = (token)=>{
    try {
        return jwt.verify(token, JWT_KEY)
    } catch (error) {  //如果验证报错
        res.status(401).json({error:'Invalid Token'})  //目前token过期或者token无效都返回同一个值，也可以分别处理
    }
}

module.exports = {generateToken, validateToken}