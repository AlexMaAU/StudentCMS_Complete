//用来对密码等高度敏感并且不需要在客户端显示的数据进行加密

//导入bcrypt包
const bcrypt = require('bcrypt')

const password = '1234565'

//传入的两个参数分别是要加密的数据，和 加盐的轮数（加盐越多破解难度越大）
const hashedPassword = bcrypt.hashSync(password, 10)

//加密已经完成了，但是每次salt的值都是随机的，所以每次生成的hashedPassword都是不同的，这样导致没办法比较数据
console.log(hashedPassword)

//所以我们需要把salt的值固定下来
const salt = bcrypt.genSaltSync(10)  //生成一个盐，然后记录下来，后面每次对比这个密码都要使用这个salt

const saltGenerated = '$2b$10$5E5dgLWxA0GxAmVpyVWqDe'

console.log(salt)
const constHashedPassword = bcrypt.hashSync(password, saltGenerated)  //salt固定，那么生成的hash salt值也就是固定的
console.log(constHashedPassword)

//比较两个密码的harsh值是否一样
//当使用 bcrypt.compareSync 函数进行密码比较时，它会从已存储密码的哈希值中提取 salt，并将提取的 salt 与传入的密码进行哈希计算。然后它将计算出的哈希值与存储的哈希值进行比较，以确定密码是否匹配。
//所以使用 bcrypt.compareSync 的时候不需要像上面的代码一样手动记录 salt 的值
const result = bcrypt.compareSync(password, constHashedPassword)
console.log(result)

