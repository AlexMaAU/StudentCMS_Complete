const {Schema, model} = require('mongoose')
const joi = require('joi')

const teacherSchema = new Schema({
    firstName: {
        type:String,
        required:true,
        minLength:2
    },
    lastName: {
        type:String,
        required:true,
        minLength:2
    },
    email: {
        type:String,
        required:true,
        unique:true
        /*
        validate: [
            {
                validator: (email)=>{
                    //string()把验证内容转换成字符串
                    //email()定义验证格式
                    //validate(email)表示用之前的设置来验证email字段
                    //validate()的结果中包含error属性，如果error属性是undefined，代表验证通过。如果error属性存在，则代表验证错误
                    return joi.string().email().validate(email).error === undefined
                },
                msg: 'Invalid email format'
            }
        ]
        */
    },
    courses: [
        {
            type:Schema.Types.ObjectId,
            ref:'Course'
        }
    ]
})

const Teacher = model("Teacher", teacherSchema)

module.exports = Teacher