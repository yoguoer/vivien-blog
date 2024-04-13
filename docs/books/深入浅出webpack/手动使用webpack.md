---
title: 手动使用webpack
author: vivien
date: '2024-02-21'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - webpack
---

​        如果不使用webpack CLI，我们可以通过Node.js的require()函数来手动导入webpack和webpack配置文件，并使用webpack的API进行构建。

- 首先，确保已经安装了webpack和webpack配置文件。

```bash
npm install webpack webpack-core --save-dev
```

- 然后，在需要使用webpack的JavaScript文件中，使用以下代码导入webpack：

```bash
const webpack = require('webpack');
```

- 接下来，导入webpack配置文件。假设webpack配置文件名为webpack.config.js，使用以下代码将其导入：

```bash
const config = require('./webpack.config.js');
```

- 现在，可以使用webpack的API进行构建。

①以下是一个示例，展示了如何使用webpack进行构建：

```javascript
// 导入webpack模块，这样我们就可以使用webpack的API进行构建  
const webpack = require('webpack');  
  
// 导入我们的webpack配置文件。这个文件包含了webpack如何处理我们的项目的所有信息  
const config = require('./webpack.config.js');  
  
// 使用webpack的API执行构建过程。这里的config是我们之前导入的webpack配置  
const compiler = webpack(config);  
// 运行编译实例。编译实例执行后，会调用回调函数，将错误（如果有的话）和构建统计信息作为参数传入  
compiler.run((err, stats) => {  
  // 当构建过程完成时，回调函数会被调用。如果构建过程中出现错误，err会被赋值。stats对象包含了构建过程中的各种信息  
  if (err || stats.hasErrors()) {  
    // 如果err或stats.hasErrors()返回true，说明构建过程中出现了错误，我们将其打印出来  
    console.error(err);  
  } else {  
    // 如果构建过程没有错误，我们打印一条成功消息  
    console.log('Webpack build completed successfully.');  
  }  
});
```

②还可以用另一种写法：

```javascript
// 导入webpack模块，这样我们就可以使用webpack的API进行构建  
const webpack = require('webpack');  
  
// 创建一个Webpack配置对象。这个对象包含了webpack如何处理我们的项目的所有信息  
const config = {  
  // 指定入口文件的路径。这里假设入口文件为./src/index.js  
  entry: './src/index.js',   
  // 配置输出目录的路径。这里假设输出目录为项目根目录下的dist文件夹  
  output: {  
    path: path.resolve(__dirname, 'dist'),   
    // 指定输出文件的名称。这里假设输出文件名为bundle.js  
    filename: 'bundle.js'   
  }  
};  
  
// 使用webpack的API执行构建过程。这里的config是我们之前创建的Webpack配置对象  
webpack(config, (err, stats) => {  
  // 当构建过程完成时，回调函数会被调用。如果构建过程中出现错误，err会被赋值。stats对象包含了构建过程中的各种信息  
  if (err || stats.hasErrors()) {  
    // 如果err或stats.hasErrors()返回true，说明构建过程中出现了错误，我们将其打印出来  
    console.error(err);  
  } else {  
    // 如果构建过程没有错误，我们打印一条成功消息  
    console.log('Webpack build completed successfully.');  
  }  
});
```

在上面的示例中，webpack(config, callback)函数用于执行构建。config参数是要使用的webpack配置对象，callback参数是一个回调函数，在构建完成后被调用。如果构建过程中出现错误或警告，它们将作为回调函数的参数传递给err和stats。我们可以根据需要进行错误处理或输出构建结果。
