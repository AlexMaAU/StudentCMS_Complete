const express = require('express')
const courseRouter = express.Router()
const {getAllCourses, getCourseById, createCourse, updateCourse, deleteCourseById, addTeacherToCourse, deleteTeacherFromCourse} = require('../controllers/courses')

courseRouter.get('/', getAllCourses)
courseRouter.get('/:id', getCourseById)
courseRouter.post('/', createCourse)
courseRouter.put('/', updateCourse)
courseRouter.delete('/:id', deleteCourseById)
courseRouter.post('/:courseId/teachers/:teacherId/students/:studentId', addTeacherToCourse)
courseRouter.delete('/:courseId/teachers/:teacherId', deleteTeacherFromCourse)

module.exports = courseRouter