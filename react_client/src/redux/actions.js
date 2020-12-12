/*
包含所有action creator 函数的模块
 */

import {
  AUTH_SUCCESS,
  ERROR_MSG
} from './action-types'
import {
  reqRegister,
  reqLogin
} from "../api";

//请求成功
export const anthSuccess = (user) => ({type: AUTH_SUCCESS, data: user})

//请求失败
export const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})

//注册异步action
export const register = (user) => {
  const {username, password, password2, type} = user
  if (!username) {
    return errorMsg('用户名不能为空!')
  } else if (!password) {
    return errorMsg('密码不能为空!')
  }else if(password!==password2){
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
