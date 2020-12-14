/*
包含多个接口请求模块接口
 */

import ajax from './ajax'

//用户注册
export const reqRegister = (user) => ajax('/register', user, "POST")
//用户登陆
export const reqLogin = (user) => ajax('/login', user, "POST")
//用户更新
export const reqUpdateUser = (user) => ajax('/update', user, "POST")
//获取用户信息
export const reqUser = () => ajax('/user')
//获取用户列表
export const reqUserList = (type) => ajax('/userlist', {type})
