import request from '@/utils/request'
export function fetchList() {
  // const data = {
  //   studentId:studentName,
  //   studentPwd:password
  // }
  return request({
    url: '/topic/get/list',
    method: 'get',
  })
}
export function fetchList2(username) {
  const data = {
    studentId:username
  }
  return request({
    url: 'topic/show/selectedtopic',
    method: 'get',
    params:data
  })
}
export function cancel(studentId,topicId) {
  const data = {
    studentId,
    topicId
  }
  return request({
    url: '/topic/drop/topic',
    method: 'get',
    params:data
  })
}

export function select(studentId,topicId) {
  const data = {
    studentId,
    topicId
  }
  return request({
    url: '/topic/select/topic',
    method: 'get',
    params:data
  })
}
