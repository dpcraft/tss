import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import TeacherHome from '@/components/TeacherHome'
import Login from '@/components/Login'
import TeacherLogin from '@/components/TeacherLogin'
import store from '@/store/store'
import * as types from '@/store/types'

Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Home',
//       meta: {
//         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
//       },
//       component: Home
//     },{
//       path: '/Login',
//       name: 'Login',
//       component: Login
//     }
//   ]
// })

const routes = [
    {
      path: '/',
      name: 'Home',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: Home
    },{
      path: '/Login',
      name: 'Login',
      component: Login
    },{
    path: '/TeacherLogin',
    name: 'TeacherLogin',
    component: TeacherLogin
    },{
    path: '/TeacherHome',
    name: 'TeacherHome',
    meta: {
      requireTeacherAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: TeacherHome
  }

  ];
if (window.localStorage.getItem('token')) {
  let data = {
    username: window.localStorage.getItem('token'),
    token: window.localStorage.getItem('username'),
    classNo: window.localStorage.getItem('classNo'),

  }
  store.commit(types.LOGIN, data)
}

const router = new Router({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    console.error('xxxx',store.state.token)
    if (store.state.token) {
      next();
    }
    else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }else if (to.matched.some(r => r.meta.requireTeacherAuth)) {
    console.error('xxxx',store.state.token)
    if (store.state.token) {
      next();
    }
    else {
      next({
        path: '/teacherLogin',
        query: {redirect: to.fullPath}
      })
    }
  }
  else {
    next();
  }
})

export default router;

