const express = require('express')
const indexRouter = express.Router()
const fs = require('fs')
const path = require('path')
const studentRouter = require('../routes/students')
const courseRouter = require('../routes/courses')
const teacherRouter = require('../routes/teachers')
const authRouter = require('../routes/auth')
const tokenAuth = require('../middlewares/tokenAuth')

indexRouter.use(express.json())

indexRouter.use('/teachers', tokenAuth, teacherRouter)  //app.use([path], callback, [callback])。其中callback : 指定的中间件函数，可以是多个。并且这些回调函数可以调用next().

indexRouter.use('/students', tokenAuth, studentRouter)  //所以把tokenAuth中间件加在studentRouter中间件前面，表示tokenAuth会在studentRouter之前先执行

indexRouter.use('/courses', tokenAuth, courseRouter)

indexRouter.use('/auth', authRouter)

indexRouter.get('/',(req,res)=>{
    fs.readFile(path.join(__dirname,'../views/index.html'), (err,data)=>{
        if(err) throw err
        res.write(data)
        res.end()
    })
})

module.exports = indexRouter