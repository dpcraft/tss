import axios from 'axios'
// import { Message } from 'element-ui'
import store from '@/store/store'
import * as types from '@/store/types'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: 'https://api.github.com', // api 的 base_url
  timeout: 5000 // request timeout
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers.Authorization = `token ${store.state.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT)

          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'login' &&
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.path },
          })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  },
)

export default service