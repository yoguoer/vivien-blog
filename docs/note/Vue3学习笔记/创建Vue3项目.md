---
title: 创建Vue3项目
author: vivien
date: '2024-03-23'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Notes
tags:       # 标签
 - Vue
---

## 使用 vue-cli 创建

```bash
npm install -g @vue/cli
vue --version
vue create my-project
cd my-project
npm run serve
```

## 使用 vite 创建

```bash
npm init vite-app <project-name>
cd <project-name>
npm install
npm run dev
```

​         webpack构建与vite构建对比图如下:

![img](./images/vue3Learning-4.png)

![img](./images/vue3Learning-5.png)