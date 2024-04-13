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

![img](http://www.kdocs.cn/api/v3/office/copy/VmN1M25NbEhiZTNVajBMRzd1ZzdBQ2dmN01BS0Z5ZVBFdEFneExGOTRuREhIUk9BRjVwWDJvMnREK3VwbW1iU1N2eUttNjQ4TFllczF4NDZyYzRjV2I5bFdKZVhLUEZXQVc2cndjNURwVkhYZERnM2FRUzgrbmhjT1d4eVVzazlzY1l6RENOSnNMaStGU1JXd0RrQ3VIS3d5alFhUGt1SnIwa1Q4L3NzR2RveEttMWd6SWw0eFNaZStLaSs2MWVVb04zanVrVXhoL0xXenNiSWhDb01UTVJjVjVKTkZKYXlSQTMxY2lmeGx4ckh2RTZuMVlsNjRKZzU5YmE1RWd6M1ZjL2gvWGlpOWdJPQ==/attach/object/XXHATCYXACQAK?)

![img](http://www.kdocs.cn/api/v3/office/copy/VmN1M25NbEhiZTNVajBMRzd1ZzdBQ2dmN01BS0Z5ZVBFdEFneExGOTRuREhIUk9BRjVwWDJvMnREK3VwbW1iU1N2eUttNjQ4TFllczF4NDZyYzRjV2I5bFdKZVhLUEZXQVc2cndjNURwVkhYZERnM2FRUzgrbmhjT1d4eVVzazlzY1l6RENOSnNMaStGU1JXd0RrQ3VIS3d5alFhUGt1SnIwa1Q4L3NzR2RveEttMWd6SWw0eFNaZStLaSs2MWVVb04zanVrVXhoL0xXenNiSWhDb01UTVJjVjVKTkZKYXlSQTMxY2lmeGx4ckh2RTZuMVlsNjRKZzU5YmE1RWd6M1ZjL2gvWGlpOWdJPQ==/attach/object/OMCQVCYXADQAK?)