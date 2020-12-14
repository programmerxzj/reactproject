/*
包含所有action creator 函数的模块
 */

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST
} from './action-types'
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList
} from "../api";

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
