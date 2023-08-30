const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
        unique: true
    }
})

//哈希加密
userSchema.methods.hashPassword = async function() {
    //用哈希加密后的密码去覆盖掉原来的密码
    this.password = await bcrypt.hash(this.password, 10)
}

//哈希验证
userSchema.methods.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password)
}

const User = model("User", userSchema)

module.exports = User