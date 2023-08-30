const express = require('express')
const {getAllTeachers,getTeacherById,createTeacher,updateTeacher,deleteTeacherById} = require('../controllers/teachers')
const teacherRouter = express.Router()

teacherRouter.get('/', getAllTeachers)

teacherRouter.get('/:id', getTeacherById)

teacherRouter.post('/', createTeacher)

teacherRouter.put('/', updateTeacher)

teacherRouter.delete('/', deleteTeacherById)


module.exports = teacherRouter