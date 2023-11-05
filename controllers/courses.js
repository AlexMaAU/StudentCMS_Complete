const Course = require('../models/courses')
const Teacher = require('../models/teachers')
const Student = require('../models/students')
const joi = require('joi')
const {courseSchemaValidate} = require('../utils/validate')

//不管是request还是validate，都可能会出现错误，所以需要设置错误处理机制
//以下是常见的错误处理方式 - 异步请求错误处理机制
/*
1. callback形式 - err只会处理当前请求的错误，所以每个回调函数都需要写一次错误处理。所以这种形式目前已经很少用了。
Course.find().exec((err,data)=>{  //服务请求执行的时候直接在callback中处理
    if(err) {  //如果有错误
        res.status(500).json({error:'something went wrong'})
        return
    }
    res.json(data)
})

2. promise
Course.find().exec().then((data)=>{
    res.json(data)
}).catch((err)=>{
    res.status(500).json({error:'something went wrong'})
})

3. async/await语法 - catch()会统一处理try()里的所有错误，如果内部有多个异步请求，无法很好的分辨出哪个请求出错了，如果有必要，需要对特定请求单独嵌套try catch
try {
    const courses = await Course.find().exec()
} catch(error) {
    console.log(error)
    res.status(500).json({error:'something went wrong'})
}
*/

// 下面使用 try catch 在代码块内进行异常处理
// 但是存在重复代码，那么也可以直接把异常传递给next中间件进行统一处理，见 studentController
const getAllCourses = async (req,res)=>{
    //populate多个属性，用数组[]形式传入
    try {
        const courses = await Course.find().populate(['students','teachers']).exec()  
        res.json(courses)
    } catch (error) {
        console.error(error)  //实际开发不会用console.error，会用winston等第三方包
        res.status(500).json({error:'something went wrong'})
    }
}

const getCourseById = async (req,res)=>{
    const {id} = req.params
    const courses = await Course.findById(id).populate(['students','teachers']).exec()
    if(courses.length == 0) {  //if courses is empty
        res.status(404).json({error:'No course data'})
        return
    } 
    res.json(courses)
}

const createCourse = async (req,res)=>{
    const {name,description} = req.body
    //model中一般只做最基本的数据类型验证
    //其他复杂的数据验证会单独进行设置
    //可以把验证部分单独提取出来放在一个文件里，这样就可以共用代码
    /*
    验证方法三：
    const schema = joi.object({
        name:joi.string().min(2).max(10).required(),
        description:joi.string().min(5).max(100).optional(),
        code:joi.string().regex(/^{a-zA-Z0-9}+$/).message('Invalid code format').required()
    })
    */
    //validateAsync里可以单独传入{name,description,code}
    //如果为了简单，也可以直接使用req.body。但是因为req.body直接赋值会比较危险，这时可以后面加上参数 {allowUnknown:true, stripUnknown:true}
    //{allowUnknown:true, stripUnknown:true} 表示可以往验证数据里添加不认识的属性，但是最后会把不认识的属性都删掉
    const validbody = await courseSchemaValidate.validateAsync(req.body, {allowUnknown:true, stripUnknown:true})  //验证成功，返回数据对象，失败则返回错误对象
    const course = new Course(validbody)
    await course.save()
    res.status(201).json(course)
}

const updateCourse = async (req,res)=>{
    const {id} = req.body
    const {name,description} = req.body
    if(!name && !description) {
        res.status(404).json({error:'No request body'})
        return
    }
    const course = await Course.findByIdAndUpdate(id,{name,description},{new:true}).exec()
    res.json(course)
}

const deleteCourseById = async (req,res)=>{
    const {id} = req.params
    const course = await Course.findByIdAndDelete(id).exec()
    if(course==null) {
        res.status(404).json({error:'course id not found'})
        return
    }
    //注意：因为目前model里course和student还有teacher之间是双向绑定的，如果只把course从数据库中删除，但是student和teacher文档下的course关联不会被删除，需要手动处理
    await Student.updateMany({courses:id}, {
        $pull: {
            courses:id
        }
    })
    await Teacher.updateMany({courses:id}, {
        $pull: {
            courses:id
        }
    })
    res.json(course)
}

// post /courses/:courseId/teachers/:teacherId/students/:studentId
const addTeacherToCourse = async (req,res)=>{
    const {courseId,teacherId,studentId} = req.params
    //找到course
    const course = await Course.findById(courseId).exec()
    //找到teacher
    const teacher = await Teacher.findById(teacherId).exec()
    //找到student
    const student = await Student.findById(studentId).exec()
    //验证值是否为空
    if(course==null || teacher==null || student==null) {
        res.status(404).json({error:'No course or teacher or student found'})
        return
    }
    //给course的teachers添加值并保存
    course.teachers.addToSet(teacherId)
    course.save()
    //给teacher的courses添加值并保存
    teacher.courses.addToSet(courseId)
    teacher.save()
    //给course的students添加值并保存
    course.students.addToSet(studentId)
    course.save()
    //给student的courses添加值并保存
    student.courses.addToSet(courseId)
    student.save()
    
    //返回状态
    res.status(204).send('add success')
}

// delete /courses/:courseId/teachers/:teacherId
const deleteTeacherFromCourse = async (req,res)=>{
    const {courseId,teacherId} = req.params
    //找到course
    const course = await Course.findById(courseId).exec()
    //找到teacher
    const teacher = await Teacher.findById(teacherId).exec()
    //验证值是否为空
    if(course.length==0 || teacher.length==0) {
        res.status(404).json({error:'No course or teacher found'})
        return
    }
    //给course的teachers删除值并保存
    course.teachers.pull(teacherId)
    course.save()
    //给teacher的courses删除值并保存
    teacher.courses.pull(courseId)
    teacher.save()
    //返回状态
    res.status(204).send('delete success')
}

module.exports = {getAllCourses, getCourseById, createCourse, updateCourse, deleteCourseById, addTeacherToCourse, deleteTeacherFromCourse}