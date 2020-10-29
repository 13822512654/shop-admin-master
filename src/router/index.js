import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Index from '@/pages/Index'
//路由懒加载
const Menu = () => import('@/pages/Menu')
const Role = () => import('@/pages/Role')
const Category = () => import('@/pages/Category')
const User = () => import('@/pages/User')
const Specs = () => import('@/pages/Specs')
const Banner = () => import('@/pages/Banner')
const Goods = () => import('@/pages/Goods')
const Member = () => import('@/pages/Member')
const Seckill = () => import('@/pages/Seckill')
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [{
        path: "index",
        component: Index
      }, {
        path: "menu",
        component: Menu
      }, {
        path: "role",
        component: Role
      }, {
        path: "user",
        component: User
      }, {
        path: "category",
        component: Category
      }, {
        path: "specs",
        component: Specs
      }, {
        path: "banner",
        component: Banner
      }, {
        path: "goods",
        component: Goods
      }, {
        path: "member",
        component: Member
      }, {
        path: "seckill",
        component: Seckill
      },
      {
        path: "*",
        redirect: "/index"
      }]
    },
  ]
})

//路由守卫
router.beforeEach((to, from, next) => {
  //有token就表示已经登陆：true，没有就是false
  let token = localStorage.getItem('token');

  //已经登陆
  if (token) {
    //在保存的info里查看menus_url所允许去的路径（页面）
    let menus_url = JSON.parse(localStorage.getItem('info')).menus_url
    if (to.path == '/login') {
      next(false)
    }
    else {
      //已登录权限控制，比如客服登陆不能进入管理员的权限
      let flag = menus_url.find(item => to.path == item);//找到就是true
      console.log(flag)
      if (flag) {
        next()
      } else {
        next(false)
      }
      // next()
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router