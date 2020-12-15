var express = require('express');
var router = express.Router();

const filter = {password: 0, __v: 0}
const md5 = require('blueimp-md5')
const {UserModel,ChatModel} = require('../db/model')
/* GET home page. */
// router.get('/', function (req, res) {
// //   res.render('index', {title: 'Express'});
// // });
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
        // console.log(user._id);
        //生成一个cookie交给浏览器
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        //  返回user的json数据
        const data = {username, type, _id: user._id}
        res.send({code: 0, data})
      })
    }
  })
//  返回响应数据
})

// 登陆的路由
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

//更新的路由
router.post('/update', function (req, res) {
//  得到请求id
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({code: 1, msg: '请先登录'})
  }
//  更新数据库中对应的数据
  const user = req.body
  UserModel.findByIdAndUpdate({_id: userid}, user, function (err, olderUser) {
    const {_id, username, type} = olderUser
    if (!olderUser) {
      res.clearCookie('userid')
      res.send({code: 1, msg: '请先登录'})
    } else {
      const data = Object.assign({_id, username, type}, user)
      res.send({code: 0, data})
    }
  })

})

//获取用户信息
router.get('/user', function (req, res) {
  //  得到请求id
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({code: 1, msg: '请先登录'})
  }
  UserModel.findOne({_id: userid}, filter, function (err, user) {
    res.send({code: 0, data: user})
  })
})

//获取指定类型用户列表
router.get('/userlist', function (req, res) {
  const {type} = req.query
  UserModel.find({type}, function (err, users) {
    res.send({code: 0, data: users})
  })
})

/*
获取当前用户所有相关聊天信息列表
 */
router.get('/msglist', function (req, res) {
  // 获取cookie中的userid
  const userid = req.cookies.userid
  // 查询得到所有user文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header}
      return users
    }, {})
    /*
    查询userid相关的所有聊天信息
     参数1: 查询条件
     参数2: 过滤条件
     参数3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from
  const to = req.cookies.userid
  /*
  更新数据库中的chat数据
  参数1: 查询条件
  参数2: 更新为指定的数据对象
  参数3: 是否1次更新多条, 默认只更新一条
  参数4: 更新完成的回调函数
   */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})


module.exports = router;
