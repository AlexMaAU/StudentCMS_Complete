//用户注册、登录，controller逻辑可以放在一起，但是route需要分开： /users  /auth
//web token验证 - 注意，也可以使用session验证，但是JWT目前使用较多。Session验证是通过浏览器cookie实现的，但是cookie仅限同域名下，跨域则需要做跨域处理。但是JWT是默认支持跨域的。
const User = require('../models/users')
const {generateToken, validateToken} = require('../utils/jwt')

//sign up
// 写到一起 POST /auth/register (特殊场景可以不遵循RESTful)
// /users/me  如果是把注册登录的router写成/auth/register，那么/users下可以查看自己的用户信息，之所以可以写成 /users/me 是因为id信息可以从token中获取
// /users/:myId  
const register = async (req, res, next)=>{
    const {username, password} = req.body
    //validation check
    //check if username is taken
    //调用user model
    /**
     * 加密也有三种使用方式：
     * 第一种：在save()之前先把password通过bcrypt.hash加密，然后把加密过的密码放入User()中然后save()。然后登录的时候用bcrypt.compare去比较两个密码。
     * 第二种：和JWT一样，单独提取出来放入一个文件，在该文件中有bcrypt.hash，和bcrypt.compare
     * 第三种：直接写在Mongoose的 Schema 文件里
     */
    const user = new User({username, password})  //用户密码在实际保存时，不会直接把密码原文保存，防止数据泄漏。通常会把密码进行加密处理再保存，比如 Hash Salt
    await user.hashPassword() //密码加密后覆盖之前的密码
    await user.save()  //这里会储存密码，密码储存的时候需要加密
    //generate token
    const token = generateToken({username})
    //send token
    res.status(201).json({username, token})  //一般用户password只在登录时进行身份验证，不会保存到token里，因为后面不再需要使用password
}

//sign in
const login = async (req, res, next)=>{
    const {username, password} = req.body
    //validation check
    //找到user
    const user = await User.findOne({username}).exec()
    //check if username exist
    if(!user) {
        res.status(401).json({error:'username not exist'})
        return
    }
    //check if password match
    if(!(await user.validatePassword(password))) {
        res.status(401).json({error:'incorrect password'})
        return
    }
    //generate token
    const token = generateToken({username})
    //send token
    res.status(201).json({username, token}) 
}

module.exports = {register, login}
