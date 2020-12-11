/*
使用mongoose 操作mongodb 的测试文件
*/

//密码加密
const md5 = require('blueimp-md5')
// 1.连接数据库
// 1.1.引入mongoose
const mongoose = require('mongoose')
// 1.2.连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/react_server_test',function (err) {
  if(err){
    throw err
  }else {
    console.log('数据库连接成功...');
  }
})
// // 1.3.获取连接对象
// const conn = mongoose.connection
// // 1.4.绑定连接完成的监听(用来提示连接成功)
// conn.on('connected', function () {
//   console.log('数据库连接成功...');
// })
// 2.得到对应特定集合的Model
// 2.1.字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
  username: {type: String, require: true},
  password: {type: String, require: true},
  type: {type: String, require: true},
  header: {type: String}
})
// 2.2.定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema)

// 3.通过Model 或其实例对集合数据进行CRUD 操作
// 3.1.通过Model 实例的save()添加数据
function testSave() {
  const user = {
    username: 'Bob',
    password:md5('234'),
    type:'laoban'
  }
  const userModel=new UserModel(user)

  userModel.save(function (err, user) {
    console.log('save()',err,user);
  })
}

// testSave()

// 3.2.通过Model 的find()/findOne()查询多个或一个数据
function testFind() {
  //find查找返回的是一个数组集合
  UserModel.find(function (err,users) {
    console.log('find()',err,users);
  })
  //findOne查找的是一个文档对象
  UserModel.findOne({username:'Tom'},function (err, user) {
    console.log('findOne()',err,user);
  })
}
// testFind()
// 3.3.通过Model 的findByIdAndUpdate()更新某个数据
function testUpdate() {
  UserModel.findByIdAndUpdate({_id:'5fd3350f77020430a41aeeb1'},{username:'Jack'},function (err, oldUser) {
    console.log('testUpdate()',err,oldUser);
  })
}
// testUpdate()
// 3.4.通过Model 的remove()删除匹配的数据
// n: 0, ok: 1, deletedCount: 0
// n deletedCount 代表删除数量  ok 代表删除状态
function testRemove() {
  UserModel.remove({_id:'5fd3350f77020430a41aeeb1'},function (err, result) {
    console.log('remove()',err,result);
  })
}
// testRemove()
