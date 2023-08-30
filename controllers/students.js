const Student = require('../models/students')
const Course = require('../models/courses')

//本js中示例使用try catch处理错误
//try catch方法对比使用callback和promise已经简化了很多，但是依然存在需要重复写try catch的问题，而catch()中的处理方式基本一样
//那么有没有可能把catch()中的处理逻辑也单独提取出来重复使用呢？使用error handling middleware或者第三方库

//catchAll函数把routeHandler中间件进行try catch验证，如果有错误，把错误pass to error handling middleware
/*
function catchAll(routeHandler) {
    return (req,res,next)=>{  //调用catchAll函数后返回一个中间件，中间件专门对routeHandler进行 try catch 验证
        try{
            routeHandler(req, res, next)  //middleware function
        } catch(error) {
            next(error)  //pass to error middleware
        }
    }
}
*/

const getAllStudents = async (req, res)=>{
    //if there is query - filter by id
    /*
    if(req.query.id) {
        //用try catch 处理错误
        try {
            //two ways to execute a query on a model. Using callback or using exec() function. 
            //exec() function returns a promise, that you can use it with then() or async/await to execute a query on a model "asynchronous".
            const students = await Student.find({_id:req.query.id}).exec()
            res.json(students)
        } catch (error) {
            res.status(404).json({error:'ID not found'})
            return
        }
    } else {
        //no query - get all data
        try {
            const students = await Student.find().exec()
            res.json(students)
        } catch (error) {
            res.status(404).json({error:'No Data'})
            return
        }
    }
    */
   //注意，只在需要获取详细信息的地方做populate，因为populate操作会耗费资源，所以不需要的地方不要去做poplate操作
   //用await语法糖代替.then()
   try {
        //two ways to execute a query on a model. Using callback or using exec() function. 
        //exec() function returns a promise, that you can use it with then() or async/await to execute a query on a model "asynchronous".
        const students = await Student.find().exec()
        res.json(students)
    } catch (error) {
        console.error(error)   //要把错误信息记录下来，实际开发不会用console.error，会用winston等第三方包专门记录错误日志
        res.status(404).json({error:'ID not found'})
    }
    /*
    const students = await Student.find().populate('courses').exec() //要完整显示关联的数据，而不是只显示id，只需要.populate()就可以，表示把student文档下的courses属性populate出来
    if(students.length==0) {  //判断返回值是否为空
        res.status(404).json({error:'Student Not Found'})
        return
    }
    res.json(students)
    */
}

const getStudentById = async (req,res,next)=>{
    //const student = await Student.find({_id:req.params.id}).exec()  //错误统一交给error handling middleware处理
    //res.json(student)
    
    try {
        //Student.findById(req.params.id)  //findById()里可以直接传入id字符串，mongoose会自动将其转换为{_id:req.params.id}的对象格式
        const student = await Student.find({_id:req.params.id}).exec()
        res.json(student)
    } catch (error) {
        next(error)  //错误统一交给error handling middleware处理
    }
    
   /*
    const {id} = req.params 
    const student = await Student.findById(id).populate('courses').exec()
    if(student.length==0) {   //判断返回值是否为空
        res.status(404).json({error:'Student Not Found'})
        return
    }
    res.json(student)
    */
}

const createStudent = async (req,res,next)=>{
    try {
        //需要validate数据 - mongoose的validate 或者 joi包 / validator.js / yup
        const {firstName,lastName,email} = req.body
        //开发的时候，创建新文档建议使用以下的方式，而不是.create()
        //原因是不需要去看req.body里会返回什么样的数据，也不会直接使用req.body的参数，而是结构赋值新的数据，不会影响原有数据
        //也不要直接把req.body作为参数直接传入，这样很危险。应该通过解构赋值，选取我们需要的数据，比如req.body中有些参数是不应该人工设置的，这时就不需要解构出来
        const student = await new Student({firstName,lastName,email}).save()
        res.json(student)
    } catch (error) {  //中间件的错误处理，也可以直接扔到错误处理中间层来处理
        next(error)  //错误统一交给error handling middleware处理
    }
}

//这里的学生信息更新方式，是每次都要直接更新整个的学生信息内容
//如果把给学生添加课程和移除课程的操作也放在这个endpoint进行，那么每次更新学生都需要把整个courses都重新覆盖一次，这样很不合理。
//而且每个学生对应多个Course，一般遇到 1：N 的情况，都会再设置一层路径，把endpoint单独分开
// 比如：PUT /students/:studentId/courses/:courseId
// /students/:studentId 确定是哪个学生
// /courses/:courseId 确定这个学生下的哪个课程
const updateStudent = async (req,res)=>{
    try {
        const {firstName,lastName,email} = req.body
        //.findByIdAndUpdate()中第三个参数{new:true}表示返回的是更新后的值，如果不加，则默认返回更新之前的数据
        const student = await Student.findByIdAndUpdate({firstName,lastName,email}, {new:true}).exec()  //没有新数据的部分会保留原数据(相当于patch操作)
        if(!student) {
            res.status(404).json({error:'student not found'})
            return
        }
        res.json(student)
    } catch (error) {
        console.error(error)
        res.status(404).json({error:'update failed'})
    }
}

const deleteStudent = async (req,res)=>{
    try {
        const student = await Student.findByIdAndDelete({_id:req.body._id}).exec()
        //注意：因为目前model里student和course之间是双向绑定的，如果只把student从数据库中删除，但是course文档下的student关联不会被删除，需要手动处理
        await Course.updateMany({students:req.body._id}, {
            $pull: {
                students:req.body._id
            }
        })
        res.json(student)
    } catch (error) {
        console.error(error)
        res.status(404).json({error:'delete failed'})
    }
}

//这里的学生信息更新方式，是每次都要直接更新整个的学生信息内容
//如果把给学生添加课程和移除课程的操作也放在这个endpoint进行，那么每次更新学生都需要把整个courses都重新覆盖一次，这样很不合理。
//而且每个学生对应多个Course，一般遇到 1：N 的情况，都会再设置一层路径，把endpoint单独分开
// 比如：/students/:studentId/courses/:courseId
// /students/:studentId 确定是哪个学生
// /courses/:courseId 确定这个学生下的哪个课程
const updateStudentById = async (req,res)=>{
    const {id,firstName,lastName,email} = req.body
    try {
        if(!id) {
            res.status(400).json({error:'No ID provided'})
            process.exit(0)
        }
        //一般开发中，对关联数据的操作，特别是关联数据可以是多个的时候(数组形式)，会设置为二级、三级路径，然后对该路径进行单独的处理
        //这里Student Model里关联的courses是数组，一个学生可以关联多个course
        //比如：
        // put /courses/:courseId/students/:studentId
        // put /courses/:courseId/teachers/:teacherId
        const updatedStudent = await Student.findByIdAndUpdate(id,{firstName,lastName,email},{new:true}).populate('courses').exec()
        res.status(201).json(updatedStudent)
    } catch (error) {
        res.status(401).json({error:'No student id found'})
    }
}

//需要给学生每次增加一个Course或者移除一个Course的操作，可以使用下面的endpoint方式
// put /students/:studentId/courses/:courseId
// 把新的Course关联添加到Student的courses下
const addCourseToStudent = async (req,res)=>{
    const {studentId,courseId} = req.params
    try {
        if(!studentId || !courseId) {
            res.status(404).json({error:'ID is empty'})
            process.exit(0)
        }
        //在 student 下添加新的 course 关联
        const student = await Student.findById(studentId).exec()
        student.courses.addToSet(courseId)
        await student.save()
        res.status(201).json(student)

        //但是 student 和 course 是双向绑定的，那么这个同时 course 下也应该新增加对应的 student 关联
        // 这样可以实现给Student添加新的Course的同时，Course也会增加对应的Student
        const course = await Course.findById(courseId).exec()
        course.students.addToSet(studentId)
        await course.save()
    } catch (error) {
        res.status(401).json({error:'Invalid ID'})
    }
}

//把Course从Student的courses下删除
// delete /students/:studentId/courses/:courseId
const removeCourseFromStudent = async(req,res)=>{
    const {studentId, courseId} = req.params 
    try {
        if(!studentId || !courseId) {
            res.status(404).json({error:'ID is empty'})
            process.exit(0)
        }
        //在 student 下删除一条 course 关联
        const student = await Student.findById(studentId).exec()
        student.courses.pull(courseId)
        await student.save()
        res.status(201).json(student)
        //但是 student 和 course 是双向绑定的，那么这个同时 course 下也应该删除对应的 student 关联
        const course = await Course.findById(courseId).exec()
        course.students.pull(studentId)
        await course.save()
    } catch (error) {
        res.status(404).json({error:'Invalid ID'})
    }
}


// 下面的addStudentToCourse和removeStudentFromCourse，应该放到Course的controller中
// put /students/:studentId/courses/:courseId
// 给Course中每次添加一个学生的关联数据
const addStudentToCourse = async (req,res)=>{
    const {studentId, courseId} = req.params
    try {
        //查找学生ID
        const student = await Student.findById(studentId).exec()
        //查找课程ID
        const course = await Course.findById(courseId).exec()
        //给学生添加课程ref
        student.courses.addToSet(courseId)
        await student.save()
        //给课程添加学生ref
        course.students.addToSet(studentId)
        await course.save()
        res.json(student)
    } catch (error) {
        console.error(error)
        res.status(404).json({error:'add to course failed'})
    }
    /*
    //查找学生ID
    const student = await Student.findById(studentId).exec()
    //查找课程ID
    const course = await Course.findById(courseId).exec()
    //如果查找结果有空值
    if(student.length==0 || course.length==0) {
        res.status(404).json({error:'student or Course not found'})
        return
    }
    //给学生添加课程ref
    student.courses.addToSet(courseId)
    await student.save()
    //给课程添加学生ref
    course.students.addToSet(studentId)
    await course.save()
    res.json(student)
    */
}

// 从Course中删除一个学生的关联数据
// delete /students/:studentId/courses/:courseId
const removeStudentFromCourse = async (req,res)=>{
    const {studentId, courseId} = req.params
    try {
        //查找学生ID
        const student = await Student.findById(studentId).exec()
        //查找课程ID
        const course = await Course.findById(courseId).exec()
        //从学生中删除课程ref并保存
        student.courses.pull(courseId)
        await student.save()
        //从课程中删除学生ref并保存
        course.students.pull(studentId)
        await course.save()
        //返回结果
        res.json(student)
    } catch (error) {
        console.error(error)
        res.status(404).json({error:'delete from course failed'})
    }
    /*
    //查找学生ID
    const student = await Student.findById(studentId).exec()
    //查找课程ID
    const course = await Course.findById(courseId).exec()
    //如果查询结果有空值
    if(student==0 || course==0) {
        res.status(404).json({error:'student or Course not found'})
        return
    }
    //从学生中删除课程ref并保存
    student.courses.pull(courseId)
    await student.save()
    //从课程中删除学生ref并保存
    course.students.pull(studentId)
    await course.save()
    //返回结果
    res.json(student)
    */
}

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    addStudentToCourse,
    removeStudentFromCourse
}