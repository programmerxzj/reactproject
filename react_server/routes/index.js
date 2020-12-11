var express = require('express');
var router = express.Router();

const filter = {password: 0,__v:0}
const md5 = require('blueimp-md5')
const {UserModel} = require('../db/model')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});
/*注册功能*/
// router.post('/register', function (req, res) {
//   const {username, password} = req.body
//   if (username=== '123') {
//     res.send({code: 1, msg: '此用户已存在'})
//   } else {
//     res.send({code: 0, data: {_id: 'abc', username, password}})
//   }
// })
/*注册路由*/
router.post('/register', function (req, res) {
//  读取请求参数
  const {username, password, type} = req.body
//  处理数据 :判断是否存在该用户
  UserModel.findOne({username}, function (err, user) {
    if (user) {
      res.send({
        code: 1, msg: '用户名已存在'
      })
    } else {
      new UserModel({username, password: md5(password), type}).save(function (err, user) {
        //生成一个cooki交给浏览器
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        //  返回user的json数据
        const data = {username, type, _id: user._id}
        res.send({code: 0, data})
      })
    }
  })
//  返回响应数据
})
//登陆的路由
router.post('/login', function (req, res) {
  const {username, password} = req.body
  UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
    if (user) {
      res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
      res.send({
        code: 0, data: user
      })
    } else {
      res.send({code: 1, msg: '用户名或密码不正确'})
    }
  })
})

module.exports = router;
