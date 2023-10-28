const express = require('express');
const studentRouter = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  addStudentToCourse,
  removeStudentFromCourse,
} = require('../controllers/students');

//get all students, can filter by query
//不用自己写中间件，使用第三方包：express-async-errors
studentRouter.get('/', getAllStudents); //catchAll函数把routeHandler中间件进行try catch验证，如果有错误，把错误pass to error handling middleware

//get student by id
studentRouter.get('/:id', getStudentById); //catchAll函数把routeHandler中间件进行try catch验证，如果有错误，把错误pass to error handling middleware

//create new student
studentRouter.post('/', createStudent);

//update student by id
studentRouter.put('/', updateStudent);

//delete student by id in body of request
studentRouter.delete('/', deleteStudent);

//add Student To Course
studentRouter.post('/:studentId/courses/:courseId', addStudentToCourse);

//delete Student from Course
studentRouter.delete('/:studentId/courses/:courseId', removeStudentFromCourse);

module.exports = studentRouter;
