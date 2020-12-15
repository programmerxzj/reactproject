const {ChatModel} = require('../db/model')
module.exports = function (server) {
  const io = require('socket.io')(server)

  // 监视客户端与服务器的连接
  io.on('connection', function (socket) {
    console.log('有一个客户端连接上了服务器', Date.now())

    // 绑定监听, 接收客户端发送的消息
    socket.on('sendMsg', function ({from, to, content}) {
      console.log('服务器接收到客户端发送的消息', {from, to, content})
      // 处理数据
      const chat_id = [from, to].sort().join('_')
      const create_time = Date.now()
      new ChatModel({from, to, content, chat_id, create_time}).save(function (err, chatMsg) {
        if (err) {
          throw err
        } else {
          io.emit('receiveMsg', chatMsg)
        }
      })
    })
  })
}


