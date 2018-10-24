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
export function uploadTopic(file) {
  let formdata = new FormData();
  formdata.append('file',file);
  return request({
    url: '/excel/import/topics',
    method: "POST",　　　　//  这个地方注意
    data:formdata


  })
}
export function uploadStd(file) {
  let formdata = new FormData();
  formdata.append('file',file);
  return request({
    url: '/excel/import/students',
    method: "POST",　　　　//  这个地方注意
    data:formdata


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
export function deleteTopic(topicId) {
  const data = {
    topicId
  }
  return request({
    url: '/topic/delete/topic',
    method: 'get',
    params:data
  })
}
export function getResult(classId) {
  const data = {
    classId
  }
  return request({
    url: '/excel/export/students',
    method: 'get',
    params:data,
    responseType: 'blob',
  })
}
export function updateTopic(topic) {
  return request({
    url: '/topic/update/data',
    method: 'post',
    data: topic

  })
}
