const {Schema,model} = require('mongoose')

const courseSchema = new Schema({
    name:{
        type:String,
    },
    description:{
        type:String,
    },
    students:[
        {
            type:Schema.Types.ObjectId,
            ref:'Student'
        }
    ],
    teachers:[
        {
            type:Schema.Types.ObjectId,
            ref:'Teacher'
        }
    ]
})

const Course = model('Course', courseSchema)

module.exports = Course