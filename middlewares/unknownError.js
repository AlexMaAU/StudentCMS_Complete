//未知错误处理中间件
//把原本的error返回信息给自定义了
const unknownError = (error,req,res,next)=>{ 
    console.error('error occurs')
    res.status(500).send('error occurs')
}

module.exports = unknownError