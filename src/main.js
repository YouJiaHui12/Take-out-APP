// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'
import VueRouter from 'vue-router'
import VueResouce from 'vue-resource'
import './util/stylus/index.styl'

// Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueResouce)
// 定义路由
const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller },
  { path: '/', redirect: '/goods' }
]
// 创建router实例，然后传routers配置
const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active', // a标签激活属性
  routes
})
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
