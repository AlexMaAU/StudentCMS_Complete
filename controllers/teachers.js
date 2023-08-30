const Teacher = require('../models/teachers')
const Course = require('../models/courses')
const {teacherSchemaValidate} = require('../utils/validate')

const getAllTeachers = async (req,res)=>{
    const teachers = await Teacher.find().exec()
    if(teachers.length == 0) {
        res.status(404).json({error:'Teacher data not found'})
        return
    }
    res.json(teachers)
}

const getTeacherById = async (req,res)=>{
    const {id} = req.params
    const teacher = await Teacher.findById(id).exec()
    if(teacher.length==0) {
        res.status(404).jason({error:'ID not found'})
        return
    }
    res.json(teacher)
}

const createTeacher = async (req,res)=>{
    const {firstName,lastName,email} = req.body
    //use validate
    const validbody = await teacherSchemaValidate.validateAsync(req.body, {allowUnknown:true, stripUnknown:true})
    const teacher = new Teacher(validbody)
    await teacher.save()
    res.json(teacher)
}

const updateTeacher = async (req,res)=>{
    const {_id,firstName,lastName,email} = req.body
    const teacher = await Teacher.findByIdAndUpdate(_id, {firstName,lastName,email}, {new:true}).exec()
    //console.log(teacher)  //null
    if(teacher == null) {
        res.status(404).json({error:'Fail to update'})
        return
    }
    res.json(teacher)
}

const deleteTeacherById = async (req,res)=>{
    const {_id} = req.body
    const teacher = await Teacher.findOneAndDelete(_id).exec()
    await Course.updateMany({students:req.body._id}, {
        $pull: {
            students:req.body._id
        }
    })
    if(teacher == null) {
        res.status(404).json({error:'Fail to delete'})
        return
    }
    res.json(teacher)
}

module.exports = {getAllTeachers,getTeacherById,createTeacher,updateTeacher,deleteTeacherById}