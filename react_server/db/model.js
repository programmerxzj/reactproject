// 1.连接数据库
// 1.1.引入mongoose
const mongoose = require('mongoose')
// 1.2.连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/react_server', function (err) {
  if (err) {
    throw err
  } else {
    console.log('数据库连接成功...');
  }
})
// 1.3.获取连接对象
// 1.4.绑定连接完成的监听(用来提示连接成功)
// 2.定义出对应特定集合的Model 并向外暴露
// 2.1.字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密 码
  type: {type: String, required: true}, // 用户类型: dashen/laoban
  header: {type: String}, // 头像名称
  post: {type: String}, // 职 位
  info: {type: String}, // 个人或职位简介company: {type: String}, // 公司名称salary: {type: String} // 工 资
})
// 2.2.定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema)
// 2.3.向外暴露Model
exports.UserModel = UserModel
