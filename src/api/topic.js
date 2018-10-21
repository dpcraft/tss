import request from '@/utils/request'
export function fetchList() {
  const data = {
    studentId:username,
    studentPwd:password
  }
  return request({
    url: '/topic/get/list',
    method: 'get',
    params:data
  })
}
export function cancle(studentId,topicId) {
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
