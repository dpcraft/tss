import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        username: '',
        token: null,
        studentName: '',
        classNo: '',
        title: '',
        teacherUsername: '',
        teacherName: '',
    },
    mutations: {
        [types.LOGIN]: (state, data) => {
          console.error('store data',data)
            localStorage.token = data.token;
            localStorage.studentName= data.studentName;
            localStorage.classNo= data.classNo;
            localStorage.username= data.username;
            state.token = data.token;
            state.studentName = data.studentName;
            state.classNo = data.classNo;
            state.username = data.username;
        },
      [types.TEACHERLOGIN]: (state, data) => {
        console.error('store data',data)

        localStorage.teacherName= data.teacherName;
        localStorage.teacherUsername= data.teacherUsername;
        state.teacherName= data.teacherName;
        state.teacherUsername= data.teacherUsername;
      },
        [types.LOGOUT]: (state) => {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('classNo')
            localStorage.removeItem('studentName')
            state.studentName = ''
            state.token = ''
            state.classNo = ''
            state.username = ''
        },
      [types.TEACHERLOGOUT]: (state) => {
        localStorage.removeItem('teacherName')
        localStorage.removeItem('teacherUsername')
        state.teacherName= '';
        state.teacherUsername= '';
      },
        [types.TITLE]: (state, data) => {
            state.title = data;
        }
    }
})
