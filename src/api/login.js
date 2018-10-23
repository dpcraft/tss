import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    studentId:username,
    studentPwd:password
  }
  return request({
    url: '/student/login',
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
    studentId:username,
    studentPwd:password
  }
  return request({
    url: '/student/update/pwd',
    method: 'get',
    params:data
  })
}
