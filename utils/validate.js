const joi = require('joi')

const courseSchemaValidate = joi.object({
    name:joi.string().min(2).max(10).required(),
    description:joi.string().min(5).max(100).optional(),
    code:joi.string().regex(/^{a-zA-Z0-9}+$/).message('Invalid code format').required()
})

const teacherSchemaValidate = joi.object({
    firstName:joi.string().min(2).max(10).required(),
    lastName:joi.string().min(2).max(10).required(),
    email:joi.string().email().required()
})

module.exports = {courseSchemaValidate, teacherSchemaValidate}