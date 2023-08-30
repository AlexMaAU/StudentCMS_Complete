const jwt = require('jsonwebtoken')

const secret = 'secret'

const payload = {
    id: 1234,
    name: 'John Doe',
}

const token = jwt.sign(payload, secret, {expiresIn: '1s'})
/**
 成功登录后，如果在浏览器中新开一个tab窗口再次进入网站，这种情况下用户应该是不需要再次登录的。前端实现的逻辑流程：
 1. 获取浏览器返回的token。如果有token，说明用户之前登录过。如果没有token，则要导回登录页面。
 2. 如果有token，则需要去判断token过期时间，又分成两种情况：
    a. token没有过期，则直接进入页面，从token的payload中获取需要的信息
    b. token过期，则一样要导回登录页面
 */

try {
    //token expire time设定是1s
    //设置一个3秒后执行的回调函数，则verify报错，因为token过期
    setTimeout(()=>{
        const valid = jwt.verify(token, secret)
        console.log(valid)  //TokenExpiredError: jwt expired
    }, 3000)
    //const valid = jwt.verify(token, secret)
    //console.log(valid)  //payload信息：{ id: 1234, name: 'John Doe', iat: 1684646123, exp: 1684646124 }
} catch (error) {
    console.log(error)
}

//token里最常包含的payload信息：id、role、avatar(个人头像)
//id表明了当前用户是谁
//role定义了当前用户有什么权限
