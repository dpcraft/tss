import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        username: '',
        token: null,
        title: ''
    },
    mutations: {
        [types.LOGIN]: (state, data) => {
            localStorage.token = data.token;
            localStorage.username= data.username;
            localStorage.classNo= data.classNo;
            state.token = data.token;
            state.username = data.username;
            state.classNo = data.classNo;
        },
        [types.LOGOUT]: (state) => {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('classNo')
            state.username = ''
            state.token = ''
            state.classNo = ''
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        }
    }
})
