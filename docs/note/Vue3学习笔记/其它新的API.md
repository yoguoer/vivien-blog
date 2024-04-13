---
title: 其它新的API
author: vivien
date: '2024-03-23'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Notes
tags:       # 标签
 - Vue
---

## 全局API的转移

### Vue 2.x 有许多全局 API 和配置

```javascript
//注册全局组件
Vue.component('MyButton', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})
//注册全局指令
Vue.directive('focus', {
  inserted: el => el.focus()
}
```

### Vue3.0中对这些API做出了调整

​        将vue2中原来是Vue.xxx的调整到应用实例(app)上app.xxx。

| 2.x 全局 API（Vue）      | 3.x 实例 API (app)          |
| ------------------------ | --------------------------- |
| Vue.config.xxxx          | app.config.xxxx             |
| Vue.config.productionTip | 移除                        |
| Vue.component            | app.component               |
| Vue.directive            | app.directive               |
| Vue.mixin                | app.mixin                   |
| Vue.use                  | app.use                     |
| Vue.prototype            | app.config.globalProperties |
| vue.mount                | app.mount                   |
| vue.unmount              | app.unmount                 |

## 其他改变

- data选项应始终被声明为一个函数。
- 过渡类名的更改(v-enter修改为v-enter-from、v-leave修改为v-leave-from)
- 移除keyCode作为v-on修饰符的支持，同时也不再支持config.keyCodes
- v-model指令在组件上的使用已经被重新设计，替换掉了 v-bind.sync。
- v-if和v-for在同一个元素身上使用时的优先级发生了变化。
- 移除了$on、$off和$once实例方法。
- 移除v-on.native修饰符
- 移除过滤器(filter)

......