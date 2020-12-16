/*
包含所有action creator 函数的模块
 */

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG
} from './action-types'
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList
} from "../api";

import io from 'socket.io-client'

function initIO(dispatch, userid) {
  if (!io.socket) {
// 连接服务器, 得到与服务器的连接对象
    io.socket = io('ws://localhost:4001')
    // 绑定监听, 接收服务器发送的消息
    io.socket.on('receiveMsg', function (chatMsg) {
      console.log('客户端接收服务器发送的消息', chatMsg)

      if (userid === chatMsg.from || userid === chatMsg.to) {
        dispatch(receiveMsg(chatMsg, userid))
      }
    })
  }
}

// 异步获取消息列表数据
async function getMsgList(dispatch, userid) {
  initIO(dispatch, userid)
  const response = await reqChatMsgList()
  const result = response.data
  if (result.code === 0) {
    const {users, chatMsgs} = result.data
    // 分发同步action
    dispatch(receiveMsgList({users, chatMsgs, userid}))
  }
}

//发送异步消息action
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    console.log('客户端向服务器发送的消息', {from, to, content});
    // debugger

    //  发送消息
    io.socket.emit('sendMsg', {from, to, content})
  }
}

//请求成功
export const anthSuccess = (user) => ({type: AUTH_SUCCESS, data: user})

//请求失败
export const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})

//接受用户
export const receiveUser = (user) => ({type: RECEIVE_USER, data: user})

//重置用户
export const resetUser = (msg) => ({type: RESET_USER, data: msg})

//接受用户列表
export const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})

// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs,userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs,userid}})

// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})

//注册异步action
export const register = (user) => {
  const {username, password, password2, type} = user
  if (!username) {
    return errorMsg('用户名不能为空!')
  } else if (!password) {
    return errorMsg('密码不能为空!')
  } else if (password !== password2) {
    return errorMsg('两次密码不一致!')
  }


  return async dispatch => {
    const response = await reqRegister({username, password, type})
    const result = response.data
    if (result.code === 0) {//成功
      getMsgList(dispatch, result.data._id)
      dispatch(anthSuccess(result.data))
    } else {//失败
      dispatch(errorMsg(result.msg))
    }
  }
}

//登录异步action
export const login = (user) => {
  const {username, password} = user
  if (!username) {
    return errorMsg('用户名不能为空!')
  } else if (!password) {
    return errorMsg('密码不能为空!')
  }

  return async dispatch => {
    const response = await reqLogin(user)
    const result = response.data
    if (result.code === 0) {//成功
      getMsgList(dispatch, result.data._id)
      dispatch(anthSuccess(result.data))
    } else {//失败
      dispatch(errorMsg(result.msg))
    }
  }
}

//更新用户异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if (result.code === 0) {
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}

//获取用户异步action
export const getUser = () => {
  return async dispatch => {
    const response = await reqUser()
    const result = response.data
    if (result.code === 0) {
      getMsgList(dispatch, result.data._id)
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}

//获取用户列表异步action
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type)
    const result = response.data

    if (result.code === 0) {
      dispatch(receiveUserList(result.data))
    }
  }
}


