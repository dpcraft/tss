import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    teacherId:username,
    teacherPwd:password
  }
  return request({
    url: '/teacher/login',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function changePwd(username, password) {
  const data = {
    teacherId:username,
    teacherPwd:password
  }
  return request({
    url: '/teacher/update/pwd',
    method: 'get',
    params:data
  })
}
