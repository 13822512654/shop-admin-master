import Vue from 'vue'
import Vuex from 'vuex'

import http from './../utils/http'
import router from './../router'
import { Message } from 'element-ui'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //因为vue里的token等信息一刷新就清空，所以要从localStorage同步信息
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    //info登陆用户信息
    //JSON.parse:从一个字符串中解析出json对象
    info: localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : ''
  },
  mutations: {
    //保存登陆数据
    //payload:token && info
    setInfo(state, payload) {
      //由于数据在vuex 里面会随着页面刷新而重置，所以要保存一份在 localStorage 中
      localStorage.setItem('token', payload.token)
      localStorage.setItem('info', JSON.stringify(payload.info))

      state.token = payload.token;
      state.info = payload.info;
    },
    //登出，清除登陆信息
    clearInfo(state, payload) {
      localStorage.clear()
      state.token = '';
      state.info = '';
    }
  },
  /*  actions: {
     
     // Action 函数接受一个 context 参数，注意，这个参数可不一般，它与 store 实例有着相同的方法和属性
     // 所以在这里可以使用 context.commit 来提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters
    
     userLogin(context, payload) {
       console.log(context)//
       //console.log(payload)//传入的参数
       http.post('/api/userlogin', payload).then(res => {
         //console.log(res)//成功的信息
         if (res.code == 200) {
           context.commit('setInfo', { token: res.list.token, info: res.list });
           router.replace("/index");
         } else {
           //登陆失败
           //  this.$message({
           //   type:'error',
           //   msg:res.msg
           // })
           Message.error(res.msg);
         }
       })
     }
   } */

})