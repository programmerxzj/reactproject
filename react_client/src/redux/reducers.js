import {combineReducers} from 'redux'

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RESET_USER,
  RECEIVE_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG,
  RECEIVE_MSG_LIST,
  MSG_READ
} from './action-types'

import {getRedirectTo} from '../utils'

const initUser = {
  username: '',
  type: '',
  msg: '',
  redirectTo: ''//需要自动重定向路径
}

//产生user的reducer
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      const {type, header} = action.data
      return {...action.data, redirectTo: getRedirectTo(type, header)}
    case ERROR_MSG:
      return {...state, msg: action.data}
    case RECEIVE_USER:
      return action.data
    case RESET_USER:
      return {...initUser, msg: action.data}
    default:
      return state
  }
}

const initUserList = []

//产生userList的reduce

function userList(state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data
    default:
      return state
  }
}


const initChat = {
  users: {}, // 所有用户信息的对象
  chatMsgs: [], // 当前用户所有相关msg的数组
  unReadCount: 0 // 未读数量
}

//产生聊天状态的reducer
function chat(state = initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:
      const {users, chatMsgs, userid} = action.data
      return {
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0), 0)
      }
    case RECEIVE_MSG:
      const {chatMsg} = action.data
      return {
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0)
      }
    case MSG_READ:
      const {from, to, count} = action.data
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map(msg => {
          if (msg.from === from && msg.to === to && !msg.read) {//需要更新
            return {...msg, read: true}
          } else {
            return msg
          }
        }),
        unReadCount: state.unReadCount - count
      }
    default:
      return state
  }
}

export default combineReducers({
  user,
  userList,
  chat
})


