/*
* 包含工具模块的函数
* */
/*
* 注册界面路由跳转
* /dashen
* /dasheninfo
* /laoban
* /laobaninfo
*
* type 和header
* */

export function getRedirectTo(type, header) {
  let path
  if (type === 'laoban') {
    path = '/laoban'
  } else {
    path = '/dashen'
  }
  if (!header) {
    path += 'info'
  }
  return path
}
