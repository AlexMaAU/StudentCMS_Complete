//验证token是否有效的中间件，需要用到utils/jwt.js中的validateToken函数
const {validateToken} = require('../utils/jwt')

module.exports = (req,res,next)=>{  //导出一个middleware
    //从请求header中获取token - token信息记录在Authorization中
    //注意：目前代码因为没有涉及前端交互，所以token信息并没有保存，测试的时候是通过在postman中添加Authorization参数来实现的(/login获取token，然后/students的时候把token放在header的Authorization里一起发送)
    //实际项目中，服务器签发token后，客户端储存token（可以在前台使用Form表单中使用隐藏域来存储这个Token，也可以放在cookie或者Local Storage本地存储里），这样发往服务端的请求表单头中就会带上Token信息
    //cookie 已经不建议用于存储。如果没有大量数据存储需求的话，可以使用 localStorage 和 sessionStorage 。对于不怎么改变的数据尽量使用 localStorage 存储，否则可以用 sessionStorage存储
    const authorization = req.header('Authorization')  
    // Bearer <token>
    if(!authorization) {
        res.status(401).json({error:'missing authorization header'})
        return
    }
    //把token按照空格划分成2部分
    const [prefix, token] = authorization.split(' ')
    if(prefix!=='Bearer' || !token) {  //如果没有加上Bearer或者token值为空
        res.status(401).json({error:'invalid authorization token format'})
        return
    }
    //检查token是否有效
    const payload = validateToken(token)  //如果验证成功，返回token中的payload信息
    req.user = payload  //把payload信息赋值给下request的user属性
    next()  //传递给下一个中间件
}