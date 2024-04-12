---
title: Webpack的使用
author: vivien
date: '2024-02-21'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Note
tags:       # 标签
 - webpack
---

## Webpack 的使用

## 1、Webpack 配置文件与核心概念

- webpack.config.js : 用于存储webpack配置信息，用于控制Webpack的行为。常规的配置如下：

```javascript
// Node.js的核心模块，专门用来处理文件路径
const path = require("path");

module.exports = {
  // JavaScript 执行入口文件，相对路径和绝对路径都行， 类型可以是string|object|array 
  entry: "./src/main.js", // 只有1个入口，入口只有1个文件
  entry: ['./app/entry1', './app/entry2'], // 只有1个入口，入口有2个文件
  entry: { // 有2个入口
    a: './app/entry-a',
    b: ['./app/entry-b1', './app/entry-b2']
  },

  // 输出，在 Webpack 经过一系列处理后，如何输出最终想要的代码
  output: {
    // 打包前清理 dist 文件夹
    clean: true,
    // path: 输出文件存放的目录，必须是 string 类型的绝对路径。
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
    path: path.resolve(__dirname, "dist"), // 输出文件都放到 dist 目录下

    // filename: 输出文件的名称
    filename: 'bundle.js', // 完整的名称
    filename: '[name].js', // 当配置了多个 entry 时，通过名称模版为不同的 entry 生成不同的文件名称
    filename: '[chunkhash].js', // 根据文件内容 hash 值生成文件名称，用于浏览器长时间缓存文件

    chunkFilename:'', // 指定在运行过程中生成的 Chunk 在输出时的文件名称

    // 发布到线上的所有资源的 URL 前缀，string 类型
    publicPath: '/assets/', // 放到指定目录下
    publicPath: '', // 放到根目录下
    publicPath: 'https://cdn.example.com/', // 放到 CDN 上去

    libraryTarget:'', // 配置以何种方式导出库
    library:'', // 配置导出库的名称
  },

  //在Webpack中，你可以直接使用outputDir选项来指定输出目录，而不必使用output属性。
  //outputDir: 'dist',
  //默认情况下，assetsDir为空字符串，表示与outputDir相同。如果想将静态资源放在一个子目录中，可设置assetsDir为想要的目录名称。
  //assetsDir: 'assets',

  // 加载器
  module: {
    rules: [],
  },
  // 插件
  plugins: [],
  // 模式
  mode: "",

  // 优化配置
  optimization: {
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
    },
    // 用于启用或禁用压缩。。
    minimizer:{}
  },

  // 开发工具
  devtool: "",

  //devServer指的是用webpack开发服务器环境，需要注意，devServer的配置只能在开发环境中。
  devServer: {},
};
```

Webpack 是基于 Node.js 运行的，所以采用 Common.js 模块化规范

- 核心概念
  - Entry（入口）：指示Webpack从哪个文件开始打包，并分析构建内部依赖图。
  - Output（出口）：指示webpack打包后的资源bundles在哪里输出文件，以及如何命名。
  - Mode（模式）：指定构建模式，指示webpack使用相应模式的配置，配置分为development（开发模式）和production（生产模式）。
  - Loader（加载器）：让webpack能够去处理那些非JavaScript文件，因为webpack自身只能解析JavaScript和json，字体、图片、css等都要交给loader和plugins处理。
  - Plugin（插件）：指定要使用的插件，可以用于执行范围更广的任务，插件的范围包括，从打包到优化和压缩，一直到重新定义环境中的变量等。在Webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
  - Module（模块）：指定加载器规则，用于处理不同类型的文件。在Webpack里一切皆模块，一个模块对应着一个文件。Webpack会从配置的Entry开始递归找出所有依赖的模块。
  - Chunk（代码块）：一个Chunk由多个模块组合而成，用于代码合并与分割。这些模块是从入口模块通过依赖分析得来的。
- Webpack配置文件中的其他常见属性：
  - devtool：指定开发工具，可以用来在开发过程中进行源码映射。
  - resolve：指定模块解析规则，可以设置别名、扩展等。

## 2、webpack的使用步骤

​        Webpack是一个用于现代JavaScript应用程序的静态模块打包器（module bundler）。它处理应用程序时，会递归地构建一个依赖关系图（dependency graph），其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle。使用Webpack的基本步骤：

- ①在项目中安装和配置Webpack。可以通过运行npm install webpack webpack-cli -D命令，安装Webpack相关的包。
- ②在项目根目录中，创建名为webpack.config.js的Webpack配置文件。在这个配置文件中，可以初始化一些基本的配置，例如指定构建模式等。
- ③在package.json配置文件中的scripts节点下，新增一个脚本。例如，可以添加一个build脚本，命令为webpack，这样就可以通过运行npm run build命令来启动Webpack进行项目打包。
- ④运行npm run build命令，启动Webpack进行项目打包。
- ⑤还可以通过运行Webpack命令npx webpack --config webpack.config.js来完成。

## 3、loader

![img](http://www.kdocs.cn/api/v3/office/copy/aW1hemVqci9aRGJWRFBlU0NiRkhZY3BlS3hsR0wybEpIRFBBTlB0UGpWZ3hQWEVnM3lqak16c1Y4eXR0K2tqcEdpenRiNjdyRy93Nno2QjVjMWZObjAyeDZKQ3ZOcXozdmdjcTlidUYrWmttaEdNdG1OMEJnN3dhbW9yaER4cm5hOGw5NHVGODV2TklOSGh5SUZET0JjRHp2RUFDMll4cEJVcUZZTTdYckxOSFVRcmtDeXJBbncvSit1MWhKUFRLM3Y3QnNrT2hhUVN3VWdVT3BzYlRBVCtGR2s0Sm5GRUNmblFNeEYxZjk1K0IxZ2tSeW0xNkFZdDNnT2NlZ0dSMHZMR3FjRWJXczlBPQ==/attach/object/YH2K6BIANI?)

- 条件匹配：通过 test 、 include 、 exclude 三个配置项来命中Loader要应用规则的文件。
  - test 属性，识别出哪些文件会被转换。
  - use 属性，定义出在进行转换时，应该使用哪个 loader。
- 应用规则：对选中后的文件通过 use 配置项来应用 Loader，可以只应用一个 Loader 或者按照从后往前的顺序应用一组 Loader，同时还可以分别给 Loader 传入参数。
- 重置顺序：一组 Loader 的执行顺序默认是从右到左执行，通过enforce选项可以让其中一个Loader 的执行顺序放到最前或者最后，pre代表在所有正常loader之前执行，post是所有之后执行。

```javascript
module.exports = {  
  // ...其他配置项...  
  module: {
    rules: [
      {
        // 命中 JavaScript 文件
        test: /\.js$/,// 正则匹配命中要使用 Loader 的文件
        include: [ // 只会命中这里面的文件
          path.resolve(__dirname, 'app')
        ],
        exclude: [ // 忽略这里面的文件
          path.resolve(__dirname, 'app/demo-files')
        ],
        use: [
        'eslint-webpack-plugin',
        //在 Loader 需要传入很多参数时，你还可以通过一个 Object 来描述
        {
          // 用 babel-loader 转换 JavaScript 文件
          // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
          loader:'babel-loader?cacheDirectory',
          options:{
             cacheDirectory:true,
           },
          // enforce:'post' 的含义是把该 Loader 的执行顺序放到最后
          // enforce 的值还可以是 pre，代表把 Loader 的执行顺序放到最前面
          enforce:'post'
        },
        // 省略其它 Loader
       ],
       // 只命中src目录里的js文件，加快 Webpack 搜索速度
       include: path.resolve(__dirname, 'src')
      },
      {
        // 命中 SCSS 文件
        test: /\.scss$/,// 正则匹配命中要使用 Loader 的文件
        // 使用一组 Loader 去处理 SCSS 文件。
        // 处理顺序为从后到前，即先交给 sass-loader 处理，再把结果交给 css-loader 最后再给 style-loader。
        use: ['style-loader', 'css-loader', 'sass-loader'],
        // 排除 node_modules 目录下的文件
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        // 对非文本文件采用 file-loader 加载
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,// 正则匹配命中要使用 Loader 的文件
        use: ['file-loader'],
      },
    ]
  }
};
```

### file-loader 和url-loader

-  file-loader 可以把 JavaScript 和 CSS 中导入图片的语句替换成正确的地址，并同时把文件输出到对应的位置。把文件输出到⼀个文件夹中，在代码中通过相对 URL 去引用输出的文件。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        use: ['file-loader']
      }
    ]
  }
};
```

- url-loader 可以在文件很小的情况下，把文件的内容经过 base64 编码后注入到 JavaScript 或者 CSS 中去。url-loader 会把根据图片内容计算出的 base64 编码的字符串直接注入到代码中，由于一般的图片数据量巨大，这会导致 JavaScript、CSS 文件也跟着变大。所以在使用 url-loader 时一定要注意图片体积不能太大，不然会导致 JavaScript、CSS 文件过大而带来的网页加载缓慢问题。
  - 一般利用 url-loader 把网页需要用到的小图片资源注入到代码中去，以减少加载次数。
  - url-loader 考虑到了以上问题，并提供了一个方便的选择 limit，该选项用于控制当文件大小小于 limit 时才使用 url-loader，否则使用 fallback 选项中配置的 loader。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        use: [{
          loader: 'url-loader',
          options: {
            // 30KB 以下的文件采用 url-loader
            limit: 1024 * 30,
            // 否则采用 file-loader，默认值就是 file-loader 
            fallback: 'file-loader',
          }
        }]
      }
    ]
  },
};
```

### parser和noParse

- noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。
- parser 属性可以更细粒度的配置哪些模块语法要解析哪些不解析，和 noParse 配置项的区别在于 parser 可以精确到语法层面， 而 noParse 只能控制哪些文件不被解析。 

```javascript
module:{
    rules:[
        ...
        {
          test:/\.jpg$/,
          type:'asset',
          parser:{
            dataUrlCondition:{
              maxSize:4 * 1024 * 1024 //当图片大小大于4M时生成资源文件，否则为base64 url
            }
          }
        }
    ]
}
```

### OneOf

​        打包时每个文件都会经过所有 loader 处理，虽然因为 test 正则原因实际没有处理上，但是都要过一遍。比较慢。OneOf顾名思义就是只能匹配上一个 loader, 剩下的就不匹配了。

```javascript
module: {
    rules: [
      {
        oneOf: [
          {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,
            // use 数组里面 Loader 执行顺序是从右到左
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
              },
          },
          {
            test: /\.(png|jpe?g|gif|webp)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
              },
            },
            generator: {
              // 将图片文件输出到 static/imgs 目录中
              // 将图片文件命名 [hash:8][ext][query]
              // [hash:8]: hash值取8位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的query参数
              filename: "static/imgs/[hash:8][ext][query]",
            },
          }
        ]
      }
    ]
}
```

### cache

​        每次打包时 js 文件都要经过 Eslint 检查 和 Babel 编译，速度比较慢。我们可以缓存之前的 Eslint 检查 和 Babel 编译结果，这样第二次打包时速度就会更快了。

​        Cache是对 Eslint 检查 和 Babel 编译结果进行缓存。

### Thread

​        当项目越来越庞大时，打包速度越来越慢，甚至于需要一个下午才能打包出来代码。这个速度是比较慢的。我们想要继续提升打包速度，其实就是要提升 js 的打包速度，因为其他文件都比较少。而对 js 文件处理主要就是 eslint 、babel、Terser 三个工具，所以我们要提升它们的运行速度。我们可以开启多进程同时处理 js 文件，这样速度就比之前的单进程打包更快了。

​        thead是多进程打包：开启电脑的多个进程同时干一件事，速度更快。（注意：请仅在特别耗时的操作中使用，因为每个进程启动就有大约为 600ms 左右开销。）我们启动进程的数量就是我们 CPU 的核数。

## 4、plugins

​       Plugin 是用来扩展 Webpack 功能的，通过在构建流程里注入钩子实现，它给 Webpack 带来了很大的灵活性。在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。plugins 配置项接受一个数组，数组里每一项都是一个要使用的 Plugin 的实例，Plugin 需要的参数通过构造函数传入。

> ​        由于webpack基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务

​        要使用一个插件，只需要require() 它，然后把它添加到plugins数组中。使用 Plugin 的难点在于掌握 Plugin 本身提供的配置项，而不是如何在Webpack中接入Plugin。几乎所有 Webpack 无法直接实现的功能都能在社区找到开源的Plugin去解决，你需要善于使用搜索引擎去寻找解决问题的方法。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');  
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {  
  // ...其他配置项...  
  plugins: [  
    //使用HtmlWebpackPlugin来生成一个HTML文件，并将其输出为index.html
    new HtmlWebpackPlugin({  
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: 'src/index.html', // 指定模板文件,指向的html
      filename: 'index.html', // 输出的文件名,被打包后的html文件名  
      inject:'body'// js打包后的生成位置
    }),  
    // 所有页面都会用到的公共代码提取到 common 代码块中
    new CommonsChunkPlugin({
      name: 'common',
      chunks: ['a', 'b']
    }),
    // 提取css成单独文件
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "static/css/[name].css",
      chunkFilename: "static/css/[name].chunk.css",
    }),
    new ExtractTextPlugin({
      // 将 CSS 样式从 JavaScript 文件中提取出来并生成单独的 CSS 文件
      filename: `[name]_[contenthash:8].css`,
    }),
  ],  
};
```

​        通常，当webpack完成某个特定的任务或阶段后，会调用相应的钩子函数。插件可以注册这些钩子函数，以便在特定的事件发生时执行代码。例如，插件可以在编译开始时、编译结束时、打包开始时、打包结束时、资源发生变化时等时间节点上执行特定的任务。

以下是一些常见的钩子函数和它们的使用场景：

- entryOption: 当读取到入口文件时触发，可以修改入口文件的配置。
- afterPlugins: 在所有插件加载完毕后触发，可以执行一些与插件相关的操作。
- beforeRun: 在运行阶段开始前触发，可以执行一些预处理操作。
- run: 在运行阶段开始后触发，可以执行一些与构建无关的插件逻辑。
- watchRun: 在webpack开始监听文件变化时触发，可以执行一些与监听文件变化相关的操作。
- compilation: 在编译阶段开始时触发，可以修改或扩展全局\*配置。（全局变量，可以在插件中访问和修改）
- make: 在编译阶段开始时触发，可以修改或扩展编译过程。
- thisCompilation: 在当前编译实例开始时触发，可以访问和修改当前编译实例的编译配置。（局部变量，只能在插件内部使用）
- shouldEmit: 在输出阶段开始前触发，可以决定是否进行输出。
- compilationParams: 在编译参数被优化前触发，可以修改编译参数。

​        通过注册这些钩子函数，插件可以在构建过程的各个阶段插入自定义的逻辑，实现各种不同的功能，如资源管理、性能优化、代码拆分、环境变量注入等。

## 5、devServer

​         在Webpack中，webpack-dev-server是一个非常重要的工具，用于开发阶段提供服务器功能。DevServer 会启动一个 HTTP 服务器用于服务网页请求，同时会帮助启动 Webpack ，并接收 Webpack 发出的文件更变信号，通过 WebSocket 协议自动刷新网页做到实时预览。

​        在使用webpack-dev-server时，需要先安装Webpack。同时，为了使服务器能够正确地访问和打包项目中的文件，需要配置正确的路径和端口号。使用dev-server的基本步骤：

- ①安装webpack-dev-server：在项目根目录下，运行npm i -D webpack-dev-server，将webpack-dev-server安装到本地开发环境中。安装成功后执行 webpack-dev-server 命令， DevServer 就启动了。
- ②修改配置文件：在项目根目录下找到webpack.config.js文件，并添加devServer节点。这个节点用于配置服务器的相关参数，例如监听的端口号、文件输出路径等。
- ③启动服务器：在项目根目录下，运行npx webpack serve --open命令，即可启动服务器并打开浏览器窗口显示页面。也可以使用 npm 运行： npm run serve。
- ④修改代码：在开发过程中，当源代码发生变化时，webpack-dev-server会自动重新打包文件并更新浏览器中的页面，无需手动刷新页面。
- ⑤开启监听模式、配置模块热替换、sourceMap等等。

```javascript
  //devServer指的是用webpack开发服务器环境，需要注意，devServer的配置只能在开发环境中。
  devServer: {
    // 代理到后端服务接口，将特定的API请求代理到另一个服务器
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端服务器地址  
        changeOrigin: true, // 是否改变主机头  
        pathRewrite: {
          '^/api': '' // 将/api路径重写为空字符串  
        }
      }
    },

    contentBase: path.join(__dirname, 'dist'), // 服务器的文件根目录  
    compress: true, // 启用gzip压缩
    historyApiFallback: true, // 是否开发 HTML5 History API 网页
    port: 3000, // 端口号  
    open: true, // 配置自动打开浏览器  
    host: 'localhost', // 指定服务器绑定的主机名或IP地址，默认是localhost
    hot: true, // 启用热模块替换（HMR）
    https: false, // 是否开启 HTTPS 模式
    overlay: { // 如果发生错误，显示一个覆盖层
      warnings: false,
      errors: true
    },

    profile: true, // 是否捕捉 Webpack 构建的性能信息，用于分析什么原因导致构建性能不佳

    cache: false, // 是否启用缓存提升构建速度

    // 告知webpack-dev-server，将dist目录下的文件作为web服务的根目录,默认将文件打包输出到dist下,查看dist下文件情况就好了
    static: './dist',

    // 只有在开启监听模式时，watchOptions 才有意义
    // 默认为 false，也就是不开启
    watch: true, // 每次需要手动刷新浏览器。
    // 监听模式运行时的参数
    // 在开启监听模式时，才有意义
    watchOptions: {
      // 不监听的文件或文件夹，支持正则匹配
      // 默认为空
      ignored: /node_modules/,
      // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
      // 默认为 300ms  
      aggregateTimeout: 300,
      // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
      // 默认每隔1000毫秒询问一次
      poll: 1000
    },

    stats: { // 控制台输出日志控制
      assets: true,
      colors: true,
      errors: true,
      errorDetails: true,
      hash: true,
    },
  },
```

## 6、优化和生产配置

![img](http://www.kdocs.cn/api/v3/office/copy/aW1hemVqci9aRGJWRFBlU0NiRkhZY3BlS3hsR0wybEpIRFBBTlB0UGpWZ3hQWEVnM3lqak16c1Y4eXR0K2tqcEdpenRiNjdyRy93Nno2QjVjMWZObjAyeDZKQ3ZOcXozdmdjcTlidUYrWmttaEdNdG1OMEJnN3dhbW9yaER4cm5hOGw5NHVGODV2TklOSGh5SUZET0JjRHp2RUFDMll4cEJVcUZZTTdYckxOSFVRcmtDeXJBbncvSit1MWhKUFRLM3Y3QnNrT2hhUVN3VWdVT3BzYlRBVCtGR2s0Sm5GRUNmblFNeEYxZjk1K0IxZ2tSeW0xNkFZdDNnT2NlZ0dSMHZMR3FjRWJXczlBPQ==/attach/object/VJWLWBIAZM?)

### resolve

​        resolve是用于配置模块解析规则的选项，主要影响非代码模块的解析。通过配置resolve，可以缩短Webpack的解析时间，提高打包速度。

> 在开发中我们会有各种各样的模块依赖，这些模块可能来自于自己编写的代码，也可能来自第三方库， resolve可以帮webpack从每个require/import语句中，找到需要引入到合适的模块代码

​        Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块，Resolve 配置 Webpack 如何寻找模块所对应的文件。resolve.modules 用于配置 Webpack 去哪些目录下寻找第三方模块。resolve.modules 的默认值是 ['node_modules']，含义是先去当前目录下的 ./node_modules 目录下去找想找的模块，如果没找到就去上一级目录 ../node_modules 中找，再没有就去 ../../node_modules 中找，以此类推，这和 Node.js 的模块寻找机制很相似。

​        当安装的第三方模块都放在项目根目录下的 ./node_modules 目录下时，没有必要按照默认的方式去一层层的寻找，可以指明存放第三方模块的绝对路径，以减少寻找，配置如下：

```javascript
module.exports = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')]
  },
};
```

- 合理使用resolve.extensions：解析到文件时自动添加拓展名
- 优化resolve.modules：可以指明存放第三方模块的绝对路径，以减少寻找
- 优化resolve.alias：给一些常用的路径起一个别名，以减少查找过程

#### resolveLoader

​        resolveLoader是用于配置解析loader时的resolve，主要影响代码模块的解析。通过配置resolveLoader，可以指定如何解析使用特定loader的模块。

​        RresolveLoader 用来告诉 Webpack 如何去寻找 Loader，因为在使用 Loader 时是通过其包名称去引用的， Webpack 需要根据配置的 Loader 包名去找到 Loader 的实际代码，以调用 Loader 去处理源文件。ResolveLoader 的默认配置如下：

```javascript
module.exports = {
  resolveLoader:{
    // 去哪个目录下寻找 Loader
    modules: ['node_modules'],
    // 入口文件的后缀
    extensions: ['.js', '.json'],
    // 指明入口文件位置的字段
    mainFields: ['loader', 'main']
  }
}
```

该配置项常用于加载本地的 Loader。

### include/exclude

​        用于缩小文件搜索范围。开发时我们需要使用第三方的库或插件，所有文件都下载到 node_modules 中了。而这些文件是不需要编译可以直接使用的。所以我们在对 js 文件处理时，要排除 node_modules 下面的文件。

- include：包含，只处理 xxx 文件
- exclude：排除，除了 xxx 文件以外其他文件都处理

### sourceMap 

​        SourceMap（源代码映射）是一个用来生成源代码与构建后代码一一映射的文件的方案。

​        它会生成一个 xxx.map 文件，里面包含源代码和构建后代码每一行、每一列的映射关系。当构建后代码出错了，会通过 xxx.map 文件，从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，帮助我们更快的找到错误根源。

它有两种使用方式：

​         sourceMap: true和devtool: "source-map"都用于生成SourceMap，但它们在配置方式和使用场景上存在一些区别。总的来说，sourceMap: true是用于在特定的loader中生成SourceMap，而devtool: "source-map"是用于在webpack配置中指定SourceMap生成策略。在实际使用中，你应根据自己的需求选择合适的配置方式。

- sourceMap: true是webpack配置中的一个选项，用于在编译过程中生成SourceMap。它需要在特定的loader中设置，如css-loader、sass-loader、less-loader和postcss-loader等。当你在这些loader的options中添加sourceMap: true时，它们会生成对应的SourceMap文件，以便在开发过程中进行调试。

```javascript
npm install --save-dev source-map-loader sourcemaps-loader
module.exports = {  
  // ...其他配置项  
  module: {  
    rules: [  
      {  
        test: /\.js$/, // 这里可以根据需要修改正则表达式来匹配需要添加sourceMap的文件  
        exclude: /node_modules/, // 这里可以根据需要排除不需要添加sourceMap的文件夹  
        use: {  
          loader: 'source-map-loader', // 或者 'sourcemaps-loader'  
          options: {  
            // 这里可以配置其他选项，如devtool等  
          }  
        }  
      }  
    ]  
  }  
};
```

注意，如果你使用的是sourcemaps-loader插件，则需要在use字段中添加sourceMap参数，并将其设置为true。例如：

```javascript
use: {  
  loader: 'sourcemaps-loader',  
  options: {  
    sourceMap: true, // 设置为true以生成sourceMap  
    // 其他选项...  
  }  
}
```

- devtool: "source-map"也是webpack配置中的一个选项，用于生成SourceMap，但它是一个更高级的选项。它允许你选择不同的SourceMap生成策略，如source-map、inline-source-map等。source-map策略会生成一个单独的SourceMap文件，而inline-source-map策略会将SourceMap数据内联到打包后的文件中。选择不同的策略会影响到SourceMap的生成方式和浏览器加载SourceMap的方式，进而影响到调试过程。

```javascript
const path = require('path');  
  
module.exports = {  
  entry: './src/index.js', // 指定入口文件  
  output: {  
    path: path.resolve(__dirname, 'dist'),  
    filename: 'bundle.js' // 指定输出文件名  
  },  
  // 开发中推荐使用 'source-map'
  // 生产环境一般不开启 sourcemap
  devtool: 'source-map' // 指定使用source-map生成SourceMap  
};
```

### Tree-shaking

​        被称为摇树优化或摇树，是一种通过消除JavaScript上下文中无用的代码来优化打包结果的技术。Webpack 已经默认开启了这个功能，无需其他配置。为了使tree shaking生效，还需要保证所有模块的导出都是具名的（即使用export关键字），否则Webpack无法准确判断哪些模块被使用。

```javascript
module.exports = {
      ...
      mode:'development',
      optimization:{
        usedExports:true
      }
}
```

#### sideEffects

​        有些模块导入，只要被引入，就会对应用程序产生重要的影响。一个很好的例子就是全局样式表，或者设置全局配置的JavaScript 文件，Webpack 认为这样的文件有“副作用”，这样的文件不应该做 tree-shaking， 因为这将破坏整个应用程序。但是因为tree-shaking 会导致无差别删除代码，我们可以通过配置sideEffects来手动调节模块。

```javascript
{
    "sideEffects":["*.css"],
}
```

### Core-js

​        过去我们使用 babel 对 js 代码进行了兼容性处理，其中使用@babel/preset-env 智能预设来处理兼容性问题。它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等。但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。所以此时我们 js 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错。所以我们想要将 js 兼容性问题彻底解决。

​        core-js 是专门用来做 ES6 以及以上 API 的 polyfill。polyfill翻译过来叫做垫片/补丁。就是用社区上提供的一段代码，让我们在不兼容某些新特性的浏览器上，使用该新特性。

```javascript
module.exports = {
  // 智能预设：能够编译ES6语法
  presets: [
    [
      "@babel/preset-env",
      // 按需加载core-js的polyfill
      { useBuiltIns: "usage", corejs: { version: "3", proposals: true } },
    ],
  ],
};
```

#### polyfill

Polyfill和core-js都是为了解决浏览器兼容性问题，使新的JavaScript特性能在旧版浏览器上运行。

- Polyfill是一段代码，它为旧版浏览器提供了新特性的实现。这样，开发者就可以在代码中使用新的JavaScript特性，而不需要担心旧版浏览器的兼容性问题。
-  Core-js则是一个提供了许多现代JavaScript特性的库。它包含了大量的polyfill，可以在不同的浏览器环境中提供一致的JavaScript API。通过使用core-js，开发者可以轻松地在现代和旧版浏览器上实现相同的JavaScript功能。

### ParallelUglifyPlugin

​        ParallelUglifyPlugin是一个Webpack插件，用于并行压缩JS代码。默认情况下，Webpack使用UglifyJS插件来压缩JS代码，但它是单线程的，当 Webpack 有多个 JavaScript 文件需要输出和压缩时，它需要一个个文件进行压缩，导致压缩速度较慢。但是 ParallelUglifyPlugin 则会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过 UglifyJS 去压缩代码，但是变成了并行执行。（多核并行） 所以 ParallelUglifyPlugin 能更快的完成对多个文件的压缩工作。

​        ParallelUglifyPlugin 同时内置了 UglifyJS 和 UglifyES，也就是说 ParallelUglifyPlugin 支持并行压缩 ES6 代码。

```javascript
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      uglifyJS: {
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        },
        //compress选项用于指定是否压缩输出文件
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        }
      },
    }),
  ],
};
```

​        UglifyJS和UglifyES是两个不同的JavaScript工具，它们用于压缩和美化JavaScript代码。它们的主要区别在于它们处理的JavaScript版本。

#### UglifyJS 

​        UglifyJS是一个流行的JavaScript压缩工具，它主要用于处理ECMAScript 5（ES5）版本的JavaScript。它能够压缩、美化、转换和混淆JavaScript代码，以便更小、更快、更安全地加载和运行。UglifyJS还支持一些高级功能，如变量和函数名称的替换、代码结构化等。

#### UglifyES

​        UglifyES是UglifyJS的一个分支，它专注于处理ECMAScript 2015（ES2015）及更高版本的JavaScript。由于ES2015引入了许多新的语法和特性，UglifyES提供了一些额外的功能来支持这些新特性，例如模板字符串、默认参数、箭头函数等。

### DllPlugin-动态链接库

​         DllPlugin是一个Webpack插件，用于将第三方库这种无论怎么改业务代码构建结果都不会发生改变的模块单独拆出来构建，下次只要不改变第三方库就直接引用现成的构建结果。包含大量复用模块的动态链接库只需要编译一次，在之后的构建过程中被动态链接库包含的模块将不会在重新编译，而是直接使用动态链接库中的代码。可以用来预编译资源模块，通过DIIPlugin来对那些我们引用但是绝对不会修改的npm包进行预编译，再通过DLLReferencePlugin将预编译的模块加载进来。

Webpack 已经内置了对动态链接库的支持，需要通过2个内置的插件接入，它们分别是：

- DllPlugin 插件：用于打包出一个个单独的动态链接库文件。
- DllReferencePlugin 插件：用于在主要配置文件中去引入 DllPlugin 插件打包好的动态链接库文件。

​        需要注意的是，在使用DllPlugin时，需要将第三方库的依赖项单独拆出来构建，而不是将整个项目一起打包。这样可以减少最终打包文件的大小，提高加载速度。同时，使用DllPlugin需要配置额外的webpack配置文件，并且需要在主配置文件中引入DllReferencePlugin插件。

### Code Split-代码分割

​        打包代码时会将所有 js 文件打包到一个文件中，体积太大了。我们如果只要渲染首页，就应该只加载首页的 js 文件，其他文件不应该加载。所以我们需要将打包生成的文件进行代码分割，生成多个 js 文件，渲染哪个页面就只加载某个 js 文件，这样加载的资源就少，速度就更快。

代码分割（Code Split）主要做了两件事：

①分割文件：将打包生成的文件进行分割，生成多个 js 文件。

②按需加载：需要哪个文件就加载哪个文件。

代码分割实现方式有不同的方式，

#### 单入口

​        开发时我们可能是单页面应用（SPA），只有一个入口（单入口）。那么我们需要这样配置：

```javascript
optimization: {
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
    },
}
```

#### 多入口

SplitChunksPlugin可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。在多入口情况下使用SplitChunksPlugin来提取公共代码。

```javascript
  // 多入口
 module.exports = {
 entry: {
    //将其他包命名在entry中
     index: './src/index.js',
     another: './src/another-module.js',
 },
 output: {
    //并在output输出端中直接配置[name]对应entry中的key
     filename: '[name].bundle.js'
 //...
 },
 //...}
```

此时在 dist 目录我们能看到输出了两个 js 文件。总结：配置了几个入口，至少输出几个 js 文件。

#### 提取公共代码



![img](http://www.kdocs.cn/api/v3/office/copy/aW1hemVqci9aRGJWRFBlU0NiRkhZY3BlS3hsR0wybEpIRFBBTlB0UGpWZ3hQWEVnM3lqak16c1Y4eXR0K2tqcEdpenRiNjdyRy93Nno2QjVjMWZObjAyeDZKQ3ZOcXozdmdjcTlidUYrWmttaEdNdG1OMEJnN3dhbW9yaER4cm5hOGw5NHVGODV2TklOSGh5SUZET0JjRHp2RUFDMll4cEJVcUZZTTdYckxOSFVRcmtDeXJBbncvSit1MWhKUFRLM3Y3QnNrT2hhUVN3VWdVT3BzYlRBVCtGR2s0Sm5GRUNmblFNeEYxZjk1K0IxZ2tSeW0xNkFZdDNnT2NlZ0dSMHZMR3FjRWJXczlBPQ==/attach/object/HFJK4BIAHA?)

​        Webpack 内置了专门用于提取多个 Chunk 中公共部分的插件 CommonsChunkPlugin，CommonsChunkPlugin 大致使用方法如下：

```javascript
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

new CommonsChunkPlugin({
  // 从哪些 Chunk 中提取
  chunks: ['a', 'b'],
  // 提取出的公共部分形成一个新的 Chunk，这个新 Chunk 的名称
  name: 'common'
})
```

以上配置就能从网页 A 和网页 B 中抽离出公共部分，放到 common 中。

​        每个 CommonsChunkPlugin 实例都会生成一个新的 Chunk，这个新 Chunk 中包含了被提取出的代码，在使用过程中必须指定 name 属性，以告诉插件新生成的 Chunk 的名称。 其中 chunks 属性指明从哪些已有的 Chunk 中提取，如果不填该属性，则默认会从所有已知的 Chunk 中提取。

#### 按需加载，动态导入

方式一：也是推荐选择的方式

​        使用符合ECMAScript提案的import()语法来实现动态导入，且不影响其他模块抽离方式。当需要加载特定模块时，你可以使用import()语法动态地导入它。

例如，如果你有一个名为utils的模块，你可以这样导入它：

```javascript
// 动态导入 --> 实现按需加载
// 即使只被引用了一次，也会代码分割
import(/* webpackChunkName: "utils" */ './utils').then(({ default: utils }) => { ... })。
```

这将告诉Webpack将这个模块拆分到一个单独的bundle中，并为其分配一个唯一的chunk name。

方式二：webpack的遗留功能，使用 webpack 特定的 require.ensure

​        require.ensure 是 Webpack 的一个功能，它用于代码拆分。使用 require.ensure 可以将代码拆分成多个块，并在需要时异步加载这些块。这对于按需加载或懒加载特定模块非常有用，可以提高应用程序的性能。

```javascript
require.ensure([], (require) => {  
  const module = require('./module');  
  // 使用 module...  
});
```

​        在上面的代码中，require.ensure 接受一个数组参数，该参数包含要加载的依赖项。第二个参数是一个回调函数，该函数在依赖项加载完成后被调用。在回调函数中，你可以使用 require 语句来导入依赖项，并使用它们进行进一步的操作。

​        请注意，require.ensure 不会立即执行回调函数。它只是将回调函数添加到依赖项队列中，等待依赖项加载完成后再执行。这意味着你可以在代码的其他部分继续使用 require 语句导入其他模块，而不需要等待 require.ensure 回调函数的执行。

#### 防止重复

​        Entry dependencies入口依赖，比如，但两个模块共有lodash时，会抽离出来并取名为shared。配置 dependOn option 选项，这样可以在多个 chunk 之间共享模块：

```javascript
    entry:{
          index:{
            import:'./src/index.js',
            dependOn:'shared'
          },
          another:{
            import:'./src/another-module.js',
            dependOn:'shared'
          },
          shared:'lodash'
          index:'./src/index.js',
          another:'./src/another-module.js'
    },
```

### Externals

​        告诉 Webpack在构建过程中哪些模块应该被视为外部依赖项，而不是包含在最终的打包文件中。通过将某些模块定义为外部依赖项，Webpack将不会将这些模块打包到最终的输出文件中，而是在运行时从外部环境中获取这些模块。通过 externals 可以告诉 Webpack，JS运行环境已经内置了哪些全局变量，针对这些全局变量不用打包进代码中，而是直接使用全局变量。可以用来配置提取常用库，例如：

```javascript
module.export = {
  // 在代码中使用这些模块时，Webpack将不会将其包含在打包文件中，而是将其视为全局变量。
  externals: {
    // 把导入语句里的 jquery 替换成运行环境里的全局变量 jQuery
    jquery: 'jQuery',
    // lodash将被替换为_
    lodash: '_',
  }
}
```

​        使用externals选项可以帮助减少最终打包文件的大小，因为不需要包含那些已经在外部环境中存在的依赖项。但是，需要注意的是，使用外部依赖项需要确保在运行时环境中存在这些依赖项，否则可能会导致运行时错误。

### happypack

​        分解任务和管理线程（并行处理和多线程的方式），将loader由单线程转为多线程加速编译。将Webpack的构建任务分解为多个子进程并行执行来加速构建速度。

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        // 排除 node_modules 目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        // 把对 .css 文件的处理转交给 id 为 css 的 HappyPack 实例
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['happypack/loader?id=css'],
        }),
      },
    ]
  },
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory'],
      // ... 其它配置项
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中一样
      loaders: ['css-loader'],
    }),
    new ExtractTextPlugin({
      filename: `[name].css`,
    }),
  ],
};
```

### PostCSS和CSS

​        PostCSS是一个对CSS进行编译的工具，类似于Babel对JavaScript的处理。PostCSS并不扩展CSS语法，而是处理已经写好的CSS代码，使其更加健康。PostCSS支持下一代CSS语法，并可以自动补全浏览器前缀、自动将px单位转换为rem等。此外，PostCSS可以通过插件实现各种功能，例如自动压缩CSS代码等。

​        比如可以使用 Autoprefixer  插件自动获取浏览器的流行度及支持的属性，并为css规则自动添加前缀，将最新的css语法转换为大多数浏览器所支持的语法。

- 安装postcss、autoprefixser：【npm install postcss-loader autoprefixser -D】
- 新建文件postcss.config.js至根目录下，并配置

```javascript
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-nested')
  ]
}
```

- 注意，还需在package.json中配置浏览器列表以实现兼容效果

```javascript
{
    ...
    "browserslist":[
        "> 1%",
        "last 2 versions"
    ]
}
 
//last 2 versions:  每个浏览器中最新的两个版本。
//> 1% or >= 1%:  全球浏览器使用率大于1%或大于等于1%。
```

### babel-loader

​        用于将ES6+代码转换为ES5代码，以便在老版本浏览器上运行。它是Babel 官方提供的 Webpack 加载器，可以使用最新的 JavaScript 语言特性，同时确保代码在生产环境中的兼容性。

```javascript
// webpack.config.js,添加一个新的规则来使用 babel-loader
module.exports = {  
  module: {  
    rules: [  
      {  
        test: /\.js$/,  
        exclude: /node_modules/,  
        use: 'babel-loader',  
      },  
    ],  
  },  
};
// .babelrc,添加 Babel 的预设和插件
{  
  "presets": ["@babel/preset-env"],  
  "plugins": []  
}
```

### prefetch和preload

​        我们前面已经做了代码分割，同时会使用 import 动态导入语法来进行代码按需加载（我们也叫懒加载，比如路由懒加载就是这样实现的）。但是加载速度还不够好，比如：是用户点击按钮时才加载这个资源的，如果资源体积很大，那么用户会感觉到明显卡顿效果。我们想在浏览器空闲时间，加载后续需要使用的资源。我们就需要用上 Preload 或 Prefetch 技术。

​        在声明import时，使用下面这些内置指令，可以让webpack输出resource hint（资源提示），来告知浏览器：

- prefetch（预获取）：告诉浏览器在空闲时才开始加载资源。将来某些导航下可能需要的资源 ，即在浏览器网络空闲时再获取资源。
- preload（预加载）：告诉浏览器立即加载资源。当前导航下可能需要资源，和懒加载效果类似。

它们的共同点：

- 都只会加载资源，并不执行。
- 都有缓存。

不同之处：

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- Preload加载优先级高，Prefetch加载优先级低。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
- Preload只能加载当前页面需要使用的资源，Prefetch可以加载当前页面资源，也可以加载下一个页面需要使用的资源。

总结：

- 当前页面优先级高的资源用 Preload 加载。
- 下一个页面需要使用的资源用 Prefetch 加载。

它们的问题：兼容性较差。

- 我们可以去 Can I Useopen in new window 网站查询 API 的兼容性问题。
- Preload 相对于 Prefetch 兼容性好一点。

### Network Cache

​        开发时我们对静态资源会使用缓存来优化，这样浏览器第二次请求资源就能读取缓存了，速度很快。但是这样的话就会有一个问题, 因为前后输出的文件名是一样的，都叫 main.js，一旦将来发布新版本，因为文件名没有变化导致浏览器会直接读取缓存，不会加载新资源，项目也就没法更新了。所以我们从文件名入手，确保更新前后文件名不一样，这样就可以做缓存了。它们都会生成一个唯一的 hash 值。

- fullhash（webpack4 是 hash）：每次修改任何一个文件，所有文件名的 hash 至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。
- chunkhash：根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们 js 和 css 是同一个引入，会共享一个 hash 值。
- contenthash：根据文件内容生成 hash 值，只有文件内容变化了，hash 值才会变化。所有文件 hash 值是独享且不同的。

```javascript
output: {
    path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
    // [contenthash:8]使用contenthash，取8位长度
    filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
    assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
    clean: true,
},
```

### Prepack 

​        Prepack 由 Facebook 开源，它采用较为激进的方法：在保持运行结果一致的情况下，改变源代码的运行逻辑，输出性能更高的 JavaScript 代码。 实际上 Prepack 就是一个部分求值器，编译代码时提前将计算结果放到编译后的代码中，而不是在代码运行时才去求值。Prepack 需要在 Webpack 输出最终的代码之前，对这些代码进行优化，就像 UglifyJS 那样。

```javascript
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;

module.exports = {
  plugins: [
    new PrepackWebpackPlugin()
  ]
};
```

### PWA

​        开发 Web App 项目，项目一旦处于网络离线情况，就没法访问了。我们希望给项目提供离线体验。渐进式网络应用程序(progressive web application - PWA)：是一种可以提供类似于 native app(原生应用程序) 体验的 Web App 的技术。其中最重要的是，在离线(offline) 时应用程序能够继续运行功能。内部通过 Service Workers 技术实现的。

> ​        Service Worker是一个运行在浏览器背后的脚本，它独立于网页，可以在不依赖任何网页的情况下响应各种网络请求。它提供了一种拦截和处理网络请求、管理缓存和离线资源的能力，从而提供更好的网络性能和离线体验。
> ​        Service Worker的主要功能包括：
> 拦截网络请求：Service Worker可以拦截从浏览器发出的所有网络请求，包括对资源的请求。
> 缓存管理：Service Worker可以缓存网络请求的响应，以便在离线时提供离线内容。它还可以根据需要对缓存进行更新和替换。
> 推送通知：Service Worker可以接收推送消息，并在接收到消息时显示通知。
> 离线体验：通过拦截网络请求并缓存响应，Service Worker 可以提供更好的离线体验，即使在网络不可用时也能提供部分功能。
> 请求处理：Service Worker可以修改网络请求的响应，例如通过代理或修改内容来优化性能。
> 运行环境：Service Worker运行在Service Worker线程中，不共享主线程的资源。因此，它不会阻塞页面的渲染，提供了更好的性能和稳定性。
> ​        要使用Service Worker，需要在HTML文件中注册它，并在Service Worker脚本中编写拦截和处理网络请求的逻辑。一旦Service Worker注册成功，它将在后台运行并拦截网络请求。你可以利用这些功能来优化网页的性能、提供离线支持、实现推送通知等功能。

```javascript
const WorkboxPlugin = require("workbox-webpack-plugin");

plugins: [
   new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
]
```

这样配置后，生成的PWA应用将具有离线访问、全屏体验、搜索引擎友好等特性。

## 7、git-hooks与husky

​        为了保证团队里的开发人员提交的代码符合规范，我们可以在开发者上传代码时进行校验。 我们常用 husky 来协助进行代码提交时的 eslint 校验。husky使git hooks更易于管理，因为我们不必手动编写代码，我们只需要在husky提供的配置文件中添加想要执行的命令，例如提交之前运行ESLint，除此之外的一切都由husky处理。

```javascript
"sctript": {
 //...others
 "prepare": "husky install"
}
```

prepare是一个npm钩子，意思是安装依赖的时候，会先执行husky install命令。 这个命令就做了以下三件事：

1. 新增任意名称文件夹以及文件pre-commit(这个文件名比如跟要使用的git hook名字一致)
2. 执行以下命令来移交git-hook的配置权限
3. 给这个文件添加可执行权限

## 8、常见的minimizer

​        确保你已经安装了要使用的minimizer对应的npm包，然后在配置文件中导入它们。

### Image Minimizer

​        开发如果项目中引用了较多图片，那么图片体积会比较大，将来请求速度比较慢。我们可以对图片进行压缩，减少图片体积。注意：如果项目中图片都是在线链接，那么就不需要了。本地项目静态图片才需要进行压缩。

### TerserPlugin

​        用于JavaScript压缩的插件。通过移除未使用的代码、缩小变量名、删除未使用的代码注释等方式，减少文件大小并提高加载性能。这是UglifyJsPlugin的一个分支，它提供了更好的压缩和更安全的代码拆分功能。它还支持ES6+的语法。

### cssMinimizerPlugin

用于压缩CSS代码，移除未使用的样式和冗余的代码。css压缩也可以写optimization.minimizer里面，效果一样的。

### HtmlWebpackPlugin

​        用于HTML压缩的插件，通过简化HTML标签、移除未使用的HTML元素等方式，减少HTML文件大小并提高加载性能。可以帮助生成HTML文件，并将所有资源链接到生成的HTML文件中。

## 9、环境变量

​        想要消除 webpack.config.js 在开发环境和生产环境之间的差异，需要环境变量。webpack命令行环境配置的 --env 参数，可以允许传入任意数量的环境变量。而webpack.config.js 中可以访问到这些环境变量。例如，--env production 或--env goal=local。

- npx webpack --env production 可以通过命令传入变量区分环境

​        通常，module.exports 指向配置对象。当你在 webpack.config.js 中使用环境变量时，你需要将 module.exports （抛出对象）转换为函数，以便能够动态地传递参数。

```javascript
//...  
module.exports = (env) => {  
  return {  
    //...  
    // 根据命令行参数 env 来设置不同环境的 mode  
    mode: env.production ? 'production' : 'development',  
    entry: './src/index.js',    
    output: {    
      path: path.resolve(__dirname, 'dist'),    
      //当 env.production 为真时, 设置为 'bundle.min.js'，否则设置为 'bundle.js'
      filename: env.production ? 'bundle.min.js' : 'bundle.js'    
    },    
    // 其他配置...   
  }  
}
```

在上面的示例中，我们通过将 module.exports 对象转换为函数，并传递一个名为 env 的参数，来访问环境变量。然后，我们根据环境变量的值来动态配置 webpack 的输出文件名和环境mode。

## 10、编写loader和plugin

- loader像一个翻译官，把读到的源文件内容转译成新的文件内容，并且每个loader通过链式操作，把源文件一步步翻译成我们想要的样子。①编写loader要遵循单一原则，每个loader只做一种转译工作，②每个loader拿到的是源文件内容，可以通过返回值的方式将处理后的内容输出，③也可以调用this.callback()方法，将内容返回给webpack，④还可以通过this.async()生成一个callback函数，再用它将处理后的内容输出去。

> 在编写 loader 前，我们首先需要了解 loader 的本质
> 其本质为函数，函数中的 this 作为上下文会被 webpack 填充，因此我们不能将 loader设为一个箭头函数
> 函数接受一个参数，为 webpack 传递给 loader 的文件源内容
> 函数中 this 是由 webpack 提供的对象，能够获取当前 loader 所需要的各种信息
> 函数中有异步操作或同步操作，异步操作通过 this.callback 返回，返回值要求为 string 或者 Buffer

```JavaScript
// 导出一个函数，source为webpack传递给loader的文件源内容
module.exports = function(source) {
    const content = doSomeThing2JsString(source);
    
    // 如果 loader 配置了 options 对象，那么this.query将指向 options
    const options = this.query;
    
    // 可以用作解析其他模块路径的上下文
    console.log('this.context');
    
    /*
     * this.callback 参数：
     * error：Error | null，当 loader 出错时向外抛出一个 error
     * content：String | Buffer，经过 loader 编译后需要导出的内容
     * sourceMap：为方便调试生成的编译后内容的 source map
     * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
     */
    this.callback(null, content); // 异步
    return content; // 同步
}
```

> 一般在编写loader的过程中，保持功能单一，避免做多种功能
> 如less文件转换成 css文件也不是一步到位，而是 less-loader、css-loader、style-loader几个 loader的链式调用才能完成转换

编写 loader：

①安装依赖：首先，确保你已经安装了 webpack 和 webpack-cli。然后，安装 loader 的相关依赖。例如，如果你想编写一个处理 JavaScript 文件的 loader，你可能需要安装 babel-loader。

```bash
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-env
```

②创建 loader 文件：在项目的根目录下创建一个新文件，例如 my-loader.js。

③编写 loader 代码：在这个文件中，你需要实现一个函数，该函数接收一个参数（包含文件内容、文件路径等信息的对象），并返回一个处理后的文件内容。以下是一个简单的 JavaScript loader 示例：

```javascript
// 引入 @babel/core，它提供了 Babel 的核心功能。  
const { addBabelPlugin, addBabelPresets } = require('@babel/core');  
  
// 定义一个函数，该函数接收一个参数（包含文件内容、文件路径等信息的对象），并返回一个处理后的文件内容。  
module.exports = function(source) {  
  // 标记该 loader 可以被缓存，以提高性能。  
  this.cacheable();  
  // 异步回调函数，用于在处理完文件后调用。  
  const callback = this.async();  
  // 定义 Babel 配置选项。这里使用 @babel/preset-env 作为预设，并添加 transform-react-jsx 插件。  
  const babelOptions = {  
    plugins: [addBabelPlugin('transform-react-jsx')],  
    presets: [addBabelPresets('@babel/preset-env')],  
  };  
  // 使用 Babel 转换源代码，并返回转换后的代码。  
  return babel.transform(source, babelOptions).then(({ code }) => {  
    // 在转换完成后，调用回调函数并传递结果。  
    callback(null, code);  
  });  
};
```

④导出 loader：在 webpack.config.js 文件中，使用 module.exports 导出你的 loader。例如：

```javascript
module.exports = {  
  module: {  
    rules: [  
      {  
        test: /\.js$/,  
        exclude: /node_modules/,  
        use: 'my-loader',  
      },  
    ],  
  },  
};
```

- plugin编写比较灵活。webpack在运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果。

编写 plugin：

> 由于webpack基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务
> 在之前也了解过，webpack编译会创建两个核心对象：
> compiler：包含了 webpack 环境的所有的配置信息，包括 options，loader 和 plugin，和 webpack 整个生命周期相关的钩子
> compilation：作为 plugin 内置事件回调函数的参数，包含了当前的模块资源、编译生成资源、变化的文件以及被跟踪依赖的状态信息。当检测到一个文件变化，一次新的 Compilation 将被创建
> 如果自己要实现plugin，也需要遵循一定的规范：
> 插件必须是一个函数或者是一个包含 apply 方法的对象，这样才能访问compiler实例
> 传给每个插件的 compiler 和 compilation 对象都是同一个引用，因此不建议修改
> 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

```javascript
//实现plugin的模板如下：
class MyPlugin {
    // Webpack 会调用 MyPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply (compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap('MyPlugin', compilation => {
        // compilation: 当前打包构建流程的上下文
        console.log(compilation);
        
        // do something...
    })
  }
}
```

> 在emit事件发生时，代表源文件的转换和组装已经完成，可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容

①创建 plugin 文件：在项目的根目录下创建一个新文件，例如 my-plugin.js。

②编写 plugin 代码：在这个文件中，你需要实现一个类，该类继承自 Plugin 类，并实现至少一个方法（如 apply）。以下是一个简单的 JavaScript plugin 示例：

```javascript
// 定义一个类，该类继承自 webpack 的 Plugin 类。  
class MyPlugin {  
  // 定义一个方法，该方法将在插件被应用时被调用。这里使用 tapAsync 方法在插件被应用时执行异步操作。  
  apply(compiler) {  
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {  
      // 在这里执行你想要的操作，例如修改文件内容或添加新的依赖项。  
      // 在这里添加注释说明你的插件会做的事情。例如：修改文件内容或添加新的依赖项。  
      callback();  
    });  
  }  
}
```

③导出 plugin：在 webpack.config.js 文件中，使用 module.exports 导出你的 plugin。例如：

```javascript
const MyPlugin = require('./my-plugin');  
  
module.exports = {  
  plugins: [new MyPlugin()],  
};
```
