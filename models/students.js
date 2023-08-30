const {Schema, model} = require('mongoose')
const joi = require('joi')

const studentSchema = new Schema({
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
        unique:true,
        validate: [  //表示验证这个字段 - 如果验证规则可能复用，就不要在model下直接写上validate，而是把vallidation单独放到一个文件里，在controller中进行调用验证，参考：courses controller
            {
                /*
                验证方法一：
                validator: (email)=>{  //有validator属性，对应一个匿名函数，函数内把要验证的字段传入。也就是说，每次validator都会调用匿名函数对email进行验证。
                    return /^[a-zA-Z0-9_.+-]+@[a-zA-z0-9]+\.[a-zA-Z0-9]+$/.test(email)  //对email进行正则表达式验证，返回验证true or false
                }
                */
               validator: (email) => {
                //验证方法二：
                //string()把验证内容转换成字符串
                //email()定义验证格式
                //validate(email)表示用之前的设置来验证email字段
                //validate()的结果中包含error属性，如果error属性是undefined，代表验证通过。如果error属性存在，则代表验证错误
                return joi.string().email().validate(email).error === undefined
               },
               msg: 'Invalid email format'
            }
        ]
    },
    courses: [
        {
            type:Schema.Types.ObjectId,
            ref:'Course'
        }
    ]
})

const Student = model("Student", studentSchema)

module.exports = Student