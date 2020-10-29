// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import MyTable from './components/MyTable'

// 引入样式重置
import "./assets/css/reset.css"

//引入封装的axios
import http from './utils/http'
//引入store
import store from './store'

//引入ElementUI插件
import ElementUI from 'element-ui';
//引入ElementUI插件样式
import 'element-ui/lib/theme-chalk/index.css';
//安装插件
Vue.use(ElementUI);

//添加到原型上
Vue.prototype.$http = http
Vue.config.productionTip = false

Vue.prototype.$domain = "http://localhost:3000";

//引入API（把路径用常量表示）
import API from './API'
Vue.prototype.$api = API

//引入qs
import qs from 'qs'
Vue.prototype.$qs = qs

/* const obj={
  a: 1,
  b:2
}
console.log(qs.stringify(obj))//a=1&b=2 */

//注册成全局组件
Vue.component('MyTable', MyTable)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'

});
