---
title: webpack执行流程
author: vivien
date: '2024-01-17'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Notes
tags:       # 标签
 - webpack
---

# webpack的运行流程

​        Webpack的运行流程是一个串行的过程，它的工作流程就是将各个插件串联起来，从启动到结束会依次执行以下流程：

![image-20240413162607979](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162607979.png)

​        在以上过程中，Webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack提供的API改变Webpack的运行结果。（插件只需监听它所关心的事件就能加入到这条Webpack机制中，去改变Webpack运作，使得整个系统扩展性良好。）

![image-20240413162619449](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162619449.png)

![image-20240413162631771](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162631771.png)

![image-20240413162637758](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162637758.png)

## webpack 整体流程图 

![image-20240413162645271](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162645271.png)

# 一、初始化流程

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数。
2. 安装 webpack-cli;（如果直接使用webpack的核心模块，则不需要安装webpack-cli）
   - npm install webpack webpack-cli -D
   - 这个过程实际上就是用上一步得到的参数初始化Compiler对象，并加载所有配置的插件，通过执行Compiler对象的run方法开始执行编译过程。
3. 执行 webpack-cli，并将参数传入，运行 webpack。（如果直接使用webpack的核心模块，则需要手动编写代码来调用 webpack 的 API）
   - npx webpack-cli <command> <arguments>
   - 这个过程实际上是调用webpack-cli的主入口文件bin/webpack.js。在执行时，会将命令行参数传递给webpack()函数，这个函数是webpack的主要入口点。然后，webpack内部会解析这些参数并按照webpack的配置来执行编译过程。而entry 属性用于指定入口文件或入口文件的数组。这些入口文件是 webpack 编译的起点，它会根据配置中的entry找出所有的入口文件。

## webpack的配置项

​        Webpack的配置文件的作用是激活Webpack的加载项和插件，通过定义和配置这些加载项和插件，我们可以更好地处理前端资源，优化构建过程，提高构建效率和应用程序的性能。

- 该配置文件默认为webpack.config.js，通常位于项目的根目录下；
- 也可以通过命令的形式指定其他的配置文件，例如，在执行Webpack命令时，可以通过--config参数来指定配置文件的路径。

```bash
webpack --config myconfig.js
// 在这个例子中，Webpack将使用myconfig.js作为配置文件，而不是默认的webpack.config.js。
```

​       当Webpack启动时，它会读取webpack.config.js文件，并将各个配置项拷贝到options对象中，并加载用户配置的插件plugins，并将它们添加到构建过程中。通过这些配置项和插件，我们可以定制Webpack的行为，以满足项目的特定需求，更好地处理前端资源、优化构建过程和提高构建效率。

## Shell脚本参数

shell 脚本参数一般通过 shell 直接输入或者通过 npm script 输入。

![image-20240413162658258](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162658258.png)

如上图所示，

①通过 shell 执行 npm run start 后，会自动执行 webpack --config webpack.config.js ，

②通过 shell 的 config 参数将配置文件webpack.config.js传入 webpack 中。

## Shell 与 webpack.config 解析

​        每次在命令行中输入webpack后，操作系统会查找(当前目录下)./node_modules/.bin/webpack并执行该文件作为shell脚本，以便启动Webpack构建过程。在脚本中，它可能使用了一些命令行参数来进一步定制构建过程。

这个脚本通常会包含以下逻辑：

①调用 ./node_modules/webpack/bin/webpack.js ：这是Webpack核心的入口点，它实际上执行了构建过程。

②追加任何附加的命令行参数：例如，-p和-w是两个常见的命令行参数。

- -p：这个参数通常用于生产环境构建，它会启用一些优化和压缩功能，使构建结果更小、更快。
- -w：这个参数用于启用Webpack的“watch mode”，使得Webpack在源文件发生变化时自动重新构建，而不是在每次构建时都重新读取整个项目。

这样做是为了提供一种灵活的方式来启动Webpack，并允许用户通过命令行参数来定制构建过程。

(下图中， webpack.js 是 webpack 的启动文件，而 $@ 是后缀参数)

![image-20240413162706652](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162706652.png)

​        在命令行中运行Webpack时，可以通过--参数 来传递一些指令给Webpack。这些指令会被解析为一个对象，并与Webpack的配置对象合并。合并后的配置对象会被传递给Webpack的插件和加载器，以便它们根据这些配置来执行相应的任务。

### 【CLI】optimist

​        在 webpack.js 这个文件中 webpack 通过 optimist 将用户配置的 webpack.config.js 和 shell 脚本传过来的参数整合成 options 对象传到了下一个流程的控制对象中。这个 options 对象包含了所有用于控制 Webpack 构建过程的配置和参数。

![image-20240413162712700](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162712700.png)

​        为了整合 webpack.config.js 中的配置和命令行参数，Webpack 使用了一个叫做 optimist 的库。optimist 是一个用于解析命令行参数的库，可以将命令行参数解析为 JavaScript 对象，这样它们就可以与 webpack.config.js 中的配置进行合并。它可以帮助 Webpack 将用户通过命令行传递的参数与配置文件中的选项整合在一起，形成一个完整的 options 对象。这个 options 对象会被传递给后续的插件或加载器，以便它们可以根据这些配置来执行相应的任务。

### config 合并与插件plugins加载

-  在加载插件之前，webpack将webpack.config.js中的各个配置项拷贝到options对象中，并加载用户配置在webpack.config.js的plugins。
  - 插件的默认触发阶段主要是在 Webpack 构建过程中的初始化（init）和完成（done） 阶段。
    - 初始化（init）阶段是在Webpack启动时触发的，此时Webpack正在进行一些基础的配置和初始化工作。在这个阶段，插件可以注册事件监听器，以便在后续的构建过程中接收通知。
    - 完成（done）阶段是在Webpack构建完成之后触发的，此时所有的模块都已经打包完成，Webpack正在清理临时文件并关闭相关资源。在这个阶段，插件可以执行一些收尾工作，例如输出日志、清理临时文件等。
- 接着 optimist.argv 会被传入到./node_modules/webpack/bin/convert-argv.js 中，通过判断 argv 中参数的值决定是否去加载对应插件。

```javascript
ifBooleanArg("hot", function() {
  ensureArray(options, "plugins");
  var HotModuleReplacementPlugin = require("../lib/HotModuleReplacementPlugin");
  options.plugins.push(new HotModuleReplacementPlugin());
});
...
return options;
//这段代码的目的是检查是否存在一个名为"hot"的参数，
//如果存在并且为真，那么它会确保options对象有一个插件数组，并向该数组中添加一个热模块替换插件的实例。
//最后，返回修改后的options对象。
```

- options 作为最后返回结果，包含了之后构建阶段所需的重要信息。

```javascript
{ 
  entry: {},//入口配置
  output: {}, //输出配置
  plugins: [], //插件集合(配置文件 + shell指令) 
  module: { loaders: [ [Object] ] }, //模块配置
  context: //工程路径
  ... 
}
```

- 这和 webpack.config.js 的配置非常相似，只是多了一些经 shell 传入的插件对象。插件对象一初始化完毕， options 也就传入到了下个流程中。

```javascript
var webpack = require("../lib/webpack.js");
var compiler = webpack(options);
//options是一个对象，包含了Webpack的配置信息，这些配置可以来自文件、环境变量、命令行参数等。
```

### 【手动】yargs

​        在Webpack中直接获取Shell脚本参数并不直接可能，因为Webpack和Shell脚本在运行时是相互独立的。Webpack主要处理JavaScript和相关资源文件的打包，而Shell脚本则用于执行操作系统命令和操作。只有使用CLI进行构建才能自动获取到Shell里输入的参数；如果是不依赖CLI，手动构建的，那么就需要自己写个脚本去读取和处理Shell 的参数。

​        如果想要在Webpack中获取Shell脚本参数，可以使用Node.js的命令行参数解析库，例如yargs或commander。这些库可以帮助你解析命令行参数，并在Webpack的配置文件中使用这些参数。

​         yargs 是一个非常有用的 Node.js 库，用于解析命令行参数，可以轻松地定义和解析命令行选项、参数和子命令，并将它们转换为 JavaScript 对象，这个对象可以作为参数传递给其他函数或流程，使得命令行参数的处理更加灵活和方便。

​        假设你有一个 webpack.config.js 文件，其中定义了一些 webpack 配置选项，还有一些 shell 脚本参数，你想将它们整合到一个 options 对象中，然后将这个对象传递给下一个流程。下面是一个简单的示例，展示了如何使用 yargs 来实现这个目标：

- 首先，需要确保已经安装了yargs库：

```bash
npm install yargs
```

- 创建一个 cli.js 文件，其中包含 yargs 的配置和命令行参数的处理逻辑：

```javascript
// 引入 yargs 模块，它是命令行参数解析库  
const yargs = require('yargs/yargs');  
// 引入 yargs 的 helpers，它提供了一些辅助函数，如 hideBin，用于隐藏 yargs 的内部命令  
const { hideBin } = require('yargs/helpers');  
// 引入 path 模块，用于处理文件和目录的路径  
const { join } = require('path');  
// 引入 webpack.config.js，假设它包含了一些 webpack 的配置选项  
const webpackConfig = require('./webpack.config.js');  
  
// 使用 yargs 创建一个命令行参数解析器，并隐藏 yargs 的内部命令  
const argv = yargs(hideBin(process.argv))  
  // 定义一个命令行参数 'port'，它的别名是 'p'，类型是 'number'，描述是 '指定服务器监听的端口'  
  .option('port', {  
    alias: 'p',  
    type: 'number',  
    description: '指定服务器监听的端口',  
  })  
  // 定义一个命令行参数 'env'，它的别名是 'e'，类型是 'string'，描述是 '指定环境变量'  
  .option('env', {  
    alias: 'e',  
    type: 'string',  
    description: '指定环境变量',  
  })  
  // 添加一个帮助选项，当用户在命令行中输入 --help 时，会显示帮助信息  
  .help()  
  // 解析命令行参数，将解析结果存储在 argv 对象中  
  .argv;  
  
// 将 webpack.config.js 中的配置和命令行参数合并到一个 options 对象中  
const options = { ...webpackConfig, port: argv.port, env: argv.env };  
// 打印 options 对象，以供调试或输出给下一个流程使用  
console.log(options);
```

​        在这个示例中，我们定义了两个命令行参数：port 和 env。然后，我们将 webpack.config.js 中的配置和这两个命令行参数合并到一个 options 对象中。最后，我们打印出这个 options 对象。

- 运行这个脚本：

```bash
node cli.js --port 3000 --env production
```

以下是另外一个使用yargs库的示例（必须传要求的参数）：

- 首先，你需要安装yargs库：

```bash
npm install yargs
```

- 在Webpack配置文件中，引入yargs库并解析命令行参数：

```javascript
// 导入yargs库  
const yargs = require('yargs/yargs');  
// 导入hideBin帮助函数，它用于隐藏命令行中的二进制部分  
const { hideBin } = require('yargs/helpers');  
  
// 使用yargs创建一个命令行参数对象  
const argv = yargs(hideBin(process.argv))  
  // 定义一个名为'input'的命令行参数，用户可以通过'-i'或'--input'来指定  
  .option('input', {    
    alias: 'i',    
    type: 'string',  // 参数类型为字符串  
    description: 'Input file path',  // 描述该参数的作用，即输入文件路径  
  })    
  // 定义一个名为'output'的命令行参数  
  .option('output', {    
    alias: 'o',    
    type: 'string',  // 参数类型为字符串  
    description: 'Output file path',  // 描述该参数的作用，即输出文件路径  
  })    
  // 如果用户没有提供'input'和'output'这两个参数，则显示错误信息  
  .demandOption(['input', 'output'], 'You must provide both input and output file paths')    
  // 显示帮助信息，当用户在命令行中输入'-h'或'--help'时显示  
  .help()    
  // 获取解析后的命令行参数对象  
  .argv;
```

- 在Webpack配置中使用解析后的参数：

```javascript
module.exports = {  
  // ...其他配置项...  
  // 入口文件路径，从命令行参数中获取  
  entry: argv.input,  
  // 输出配置  
  output: {  
    // 输出文件的路径，相对于当前目录，使用命令行参数指定  
    path: path.resolve(__dirname, argv.output),  
    // 输出文件的名称  
    filename: 'bundle.js',  
  },  
};
```

- 这样，当在命令行中运行Webpack时，可以通过指定命令行参数来传递输入和输出文件路径。例如：

```bash
npx webpack --input=src/index.js --output=dist/bundle.js
```

​        在这个例子中，--input和--output参数分别指定了输入和输出文件路径，你可以在Webpack配置中使用argv.input和argv.output访问这些参数，根据传递的参数来指定打包的入口和输出文件的位置。

​        执行之后，Shell命令行中传入的参数值将被合并到配置对象中，并覆盖默认值或先前指定的值。

![image-20240413162836878](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162836878.png)

下面是大佬的代码，码住：

```javascript
// 定义一个异步函数，接受一个可选参数platform，默认为空字符串  
async function runWebpackBuild(platform = '' ) {  
  // 返回一个新的Promise对象  
  return new Promise(async (resolve, reject) => {  
    try {  
      // 根据传入的platform参数，构建webpack构建脚本的路径  
      const builderPath = path.resolve(__dirname, `./webpack.${platform}.build.js`)  
      // 构建并执行Node.js命令，用于运行webpack构建脚本  
      const nodeCmd = `node ${builderPath} --lang=${argvs.lang || 'my-en'} --secondLang=${argvs.secondLang || ''} --env=${argvs.env} --staticSource=${argvs.staticSource}`}  
      // 这行代码被注释掉了，如果取消注释，它将打印出要执行的Node.js命令  
      // consola.info(`>>>> 执行命令: ${nodeCmd}` )  
      // 执行Node.js命令，等待命令执行完成  
      await execCmd( nodeCmd )  
      // 如果命令执行成功，则返回一个解析的Promise，表示构建成功  
      return resolve(true)  
    } catch (error) {  
      // 如果命令执行出错，则返回一个拒绝的Promise，表示构建失败  
      return reject(error)  
    }  
  })  
}
```

###  编译对象Compiler

​        完成上述步骤之后，则开始初始化Compiler编译对象，该对象掌控者webpack声明周期，不执行具体的任务，只是进行一些调度工作。

​        在加载配置文件和shell后缀参数申明的插件,并传入构建信息options对象后，开始整个webpack打包最漫长的一步。而这个时候，真正的webpack对象才刚被初始化,具体的初始化逻辑在 ./node_modules/webpack/lib/webpack.js中，如下所示：

```javascript
//Compiler类继承了Tapable。Compiler对象定义在./node_modules/webpack/lib/Compiler.js
//Tapable 是一个提供钩子（hooks）功能的基类，
//这些钩子允许我们在特定的事件点上执行自定义逻辑。
class Compiler extends Tapable {
    constructor(context) {//初始化时定义了很多钩子函数
        super();
        this.hooks = {
            //生命周期钩子
            beforeCompile: new AsyncSeriesHook(["params"]),
            compile: new SyncHook(["params"]),
            afterCompile: new AsyncSeriesHook(["compilation"]),
            make: new AsyncParallelHook(["compilation"]),
            entryOption: new SyncBailHook(["context", "entry"])
            // 定义了很多不同类型的钩子
        };
        // ...
    }
}

//这是一个Webpack的外部API函数，它接受一个配置对象options作为参数。
//在函数内部创建了一个新的Compiler实例。这意味着使用Webpack时，实际上是在使用这个Compiler类来处理和打包资源。
function webpack(options) {
  var compiler = new Compiler();
  ...// 检查options,若watch字段为true,则开启watch线程
  return compiler;
}
...
```

> 在 lib/webpack.js 文件中，Compiler 对象的初始化逻辑主要包括以下几个步骤：
> ①创建 Compiler 实例：通过调用 new Compiler() 创建一个新的 Compiler 实例。
> ②配置 Compiler：根据传入的配置对象（如 webpack.config.js 中定义的配置），对 Compiler 进行相应的配置，例如设置输出目录、加载器等。
> ③注册插件：通过调用compiler.hooks上的方法，注册各种插件。这些插件可以在构建过程中执行各种自定义操作，如资源优化、代码分割等。
> ④初始化其他组件：根据配置初始化其他与构建相关的组件，如Compilation、ResolverFactory等。
> ⑤返回 Compiler 实例：将初始化完成的 Compiler 实例返回，以便在构建过程中使用。

webpack编译会创建两个核心对象：

compiler：包含了webpack环境的所有的配置信息，包括options，loader和plugin，和webpack整个生命周期相关的钩子

compilation：作为plugin内置事件回调函数的参数，包含了当前的模块资源、编译生成资源、变化的文件以及被跟踪依赖的状态信息。当检测到一个文件变化，一次新的Compilation将被创建

# 二、编译与构建流程

​        当 Webpack 初始化完成后，Compiler对象会存储所有的配置和组件，但实际的构建过程还没有开始，要开始构建过程，需要调用Compiler对象的run方法。调用Compiler对象的run方法真正启动webpack构建流程，它是启动构建过程的最后一步，也是实际生成打包文件的开始，在 run 方法中，Webpack 会执行一系列的步骤来处理资源、打包代码、执行插件等，这些步骤会根据配置和插件的逻辑来执行，最终生成打包后的文件。

​        webpack 的实际入口是Compiler中的 run 方法，run 一旦执行后，就开始了编译和构建流程 ，其中有几个比较关键的 webpack 事件节点。

- compile 开始编译
  - 目的：这是整个编译过程的开始，意味着开始将源代码转换为可执行代码或目标代码。
  - 操作：读取源代码文件，并开始进行初步的解析和处理。
- make 从入口点分析模块及其依赖的模块，创建这些模块对象
  - 目的：确定项目的依赖关系，并创建模块对象以供后续处理。
  - 操作：工具（如Webpack）会分析源代码中的import或require语句，分析项目的依赖关系，并确定哪些模块需要被编译。为每个模块创建一个对象，这个对象包含了该模块的所有相关信息。
- build-module 构建模块
  - 目的：对每个模块的源代码进行处理和转换。
  - 操作：这一步包括将模块的源代码进行转换、优化、合并等操作。例如，Babel会在此阶段将ES6+的语法转换为ES5语法。
- after-compile 完成构建
  - 目的：在所有模块都构建完成后执行一些全局的操作。
  - 操作：例如，可能会进行全局的代码优化、清理临时文件等。
- seal 封装构建结果
  - 目的：将构建的结果进行封装，以便于部署和分发。
  - 操作：可能会将所有的模块和资源打包到一个或多个文件中，并进行压缩、优化等操作。
- emit 把各个chunk输出到结果文件
  - 目的：将各个模块或chunk输出到结果文件。
  - 操作：工具会根据其内部的依赖关系，将每个chunk（例如，由多个模块组成的代码块）输出到指定的结果文件。
- after-emit 完成输出
  - 目的：在所有chunks都输出到结果文件后执行一些后续操作。
  - 操作：例如，可能会复制生成的资源到输出目录、执行一些清理任务等。

![image-20240413162733161](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162733161.png)

## 核心对象 Compilation（compile 编译）

​        在Webpack的构建过程中，当调用compiler.run方法后，会触发一系列的编译阶段。其中，compile阶段是这些阶段中的第一个。

![image-20240413162727482](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162727482.png)

​        执行了run()方法后首先会触发compile ，这一步会构建出Compilation 对象。该对象是编译阶段的主要执行者，主要会依次下述流程：执行模块创建、依赖收集、分块、打包等主要任务的对象。

![image-20240413162739862](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162739862.png)

这个Compilation对象是编译阶段的主要执行者，有两个作用，

- 一、负责组织整个打包过程，包含了每个构建环节及输出环节所对应的方法，可以从图中看到比较关键的步骤，如 addEntry() , _addModuleChain() ,buildModule() , seal() , createChunkAssets() (在每一个节点都会触发 webpack 事件去调用各插件)。
- 二、该对象内部存放着所有module，chunk，生成的 asset 以及用来生成最后打包文件的template的信息。

​        Compilation对象是Webpack内部工作机制的重要部分，它具有大量的钩子(hooks)，这些钩子可以被插件用来插入自定义的逻辑。当检测到一个文件变化时，Webpack会创建一个新的Compilation对象，这样它就可以重新编译并加载进内存。在编译阶段，模块会被加载、封存、优化、分块、哈希和重新创建。这些过程都与Compilation对象紧密相关。

## 编译与构建主流程

 在创建module之前，Compiler会触发make，并调用Compilation.addEntry方法，通过options对象的entry字段找到我们的入口js文件。

之后，在addEntry中调用私有方法_addModuleChain，

这个_addModuleChain方法主要做了两件事情。

一是根据模块的类型获取对应的模块工厂并创建模块，

二是构建模块。

### 获取对应的模块工厂并创建模块（make 编译模块）

​        完成上述compilation对象后，就开始从Entry入口文件开始读取，主要执行_addModuleChain()函数。_addModuleChain 是 Webpack 的内部方法，用于处理模块链，能根据给定的依赖项创建新的模块实例。这个方法主要的工作是根据给定的 module 和 context 对象，以及一些其他参数，来创建一个新的模块。具体来说，这个方法会根据模块的类型（例如，JavaScript、CSS、图片等）来获取对应的模块工厂并创建模块。

```javascript
_addModuleChain(context, dependency, onModule, callback) {
   ...
   // 根据依赖查找对应的工厂函数
   const Dep = /** @type {DepConstructor} */ (dependency.constructor);
   const moduleFactory = this.dependencyFactories.get(Dep);
   
   // 调用工厂函数moduleFactory的create来生成一个空的NormalModule对象，NormalModul是Webpack中表示一个模块的类。 
   moduleFactory.create({
       dependencies: [dependency]
       ...
   }, (err, module) => {
       ...
       //定义一个afterBuild函数，这个函数在模块编译完成后会被调用。 
       const afterBuild = () => {
        this.processModuleDependencies(module, err => {
          if (err) return callback(err);//处理过程中发生错误，则通过回调函数返回错误信息 
           callback(null, module); //处理成功，则通过回调函数返回新创建的模块
         });
    };
       //开始模块编译。这里会调用buildModule方法来进行实际的编译操作。  
       this.buildModule(module, false, null, null, err => {
           ...
           afterBuild();//当模块编译完成后，调用之前定义的 afterBuild函数。 
       })
   })
}// _addModuleChain 方法结束
```

> _addModuleChain 是 Webpack 的内部方法，用于处理模块链。以下是该方法的主要过程：
> 1.接收参数：该方法接收四个参数，包括上下文对象 context、依赖项 dependency、回调函数 onModule 和回调函数 callback。
> 2.获取模块工厂：根据依赖项的构造类型，从 dependencyFactories 集合中获取对应的模块工厂。
> 3.创建新模块：使用获取到的模块工厂，通过 create方法创建一个新的模块实例。
> 4.添加模块到编译队列：将新创建的模块加入到编译对象的 modules 数组中，以便在后续的打包过程中使用该模块。
> 5.处理模块依赖：开始处理新创建模块的依赖项，递归地将它们也加入到编译队列中。
> 6.编译模块：当所有依赖项都处理完毕后，开始编译当前模块。Webpack 会调用 buildModule 方法来执行实际的编译操作，包括解析模块代码、生成依赖图等。
> 7.处理编译结果：当模块编译完成后，Webpack 会进行一些后续处理，例如将模块添加到编译对象的 modules 数组中，以便在后续的打包过程中使用该模块。
> 8.回调函数：当整个过程完成后，通过回调函数返回编译结果或错误信息。
>         随后执行buildModule进入真正的构建模块module内容的过程

### 构建模块（build module 完成模块编译）

> 这里主要调用配置的loaders，将我们的模块转成标准的JS模块
> 在用Loader 对一个模块转换完后，使用 acorn 解析转换后的内容，输出对应的抽象语法树（AST），以方便 Webpack后面对代码的分析
> 从配置的入口模块开始，分析其 AST，当遇到require等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系

而构建模块作为最耗时的一步，又可细化为三步：

1、调用各 loader 处理模块之间的依赖，将我们的模块转成标准的JS模块

​        webpack提供的一个很大的便利就是能将所有资源都整合成模块，不仅仅是 js文件。因此，需要一些loader ，比如url-loader、jsx-loader、css-loader等，来让我们可以直接在源文件中引用各类资源。

​        对每一个require()用对应的loader进行加工：webpack调用doBuild()，对每一个require()用对应的loader进行加工，最后生成一个js module。当webpack遇到require()或import语句时，它会使用对应的加载器(loader)处理这些依赖项。加载器可以将源文件转换成Webpack能够理解和处理的模块。然后，Webpack会调用acorn来解析这些经过加载器处理的源文件，生成抽象语法树（AST）。

```javascript
// 定义在Compilation对象上的_addModuleChain方法，该方法用于处理模块链。  
// 接收四个参数：context（上下文）、dependency（依赖项）、onModule（处理模块的回调函数）和callback（回调函数）。  
Compilation.prototype._addModuleChain = function process(context, dependency, onModule, callback) {
  // 如果Compilation对象启用了性能分析，则记录当前时间，用于后续计算该方法的执行时间。 
  var start = this.profile && +new Date();
  ...
  // 根据模块的类型获取对应的模块工厂并创建模块
  // 根据传入的依赖项的构造函数，从dependencyFactories集合中获取对应的模块工厂。  
  // 这个集合中存储了各种类型的模块工厂，用于创建不同类型的模块。
  var moduleFactory = this.dependencyFactories.get(dependency.constructor);
  ...
  moduleFactory.create(context, dependency, function(err, module) {
    var result = this.addModule(module); // 将新创建的模块添加到Compilation对象的modules数组中。
    ...
    this.buildModule(module, function(err) { // 调用buildModule方法来构建模块。
      ...
      // 构建模块，添加依赖模块
    }.bind(this)); // 由于使用了bind(this)来绑定回调函数的执行上下文为Compilation对象，所以后续操作可以在Compilation对象的上下文中进行。
  }.bind(this));
};
```

2、调用 acorn 解析经 loader 处理后的源文件，生成抽象语法树 AST

​        Acorn是一个轻量级、流式的JavaScript解析器，可以生成抽象语法树（AST）。通过Acorn解析源文件后，可以获得源文件的语法结构，以便进行进一步的分析、转换或打包。虽然加载器在处理源文件时起到重要作用，但AST的生成是由Acorn解析器完成的。

```javascript
// 定义Parser对象的parse方法，该方法用于解析源代码并返回抽象语法树(AST)。  
// 它接收两个参数：source（待解析的源代码）和initialState（初始状态）。 
 Parser.prototype.parse = function parse(source, initialState) {
  var ast;
  if (!ast) {
    // acorn以es6的语法进行解析
    ast = acorn.parse(source, {
      ranges: true, // 解析时保留每个语法元素的原始位置范围信息。  
      locations: true, // 解析时保留每个语法元素的原始位置信息。  
      ecmaVersion: 6, // 使用ECMAScript 6（即ES6）的语法版本进行解析。  
      sourceType: "module" // 将源代码视为模块，解析为模块的抽象语法树(AST)。  
    });
  }
  ...
};
```

3、遍历AST，构建该模块所依赖的模块。

​        对于当前模块，或许存在着多个依赖模块。当前模块会开辟一个依赖模块的数组，在遍历AST时，将require()中的模块通过addDependency()添加到数组中。当前模块构建完成后，webpack调用processModuleDependencies开始递归处理依赖的module，接着就会重复之前的构建步骤。

​        从配置的入口模块开始，分析其 AST，当遇到require等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系。

```javascript
// 定义Compilation对象的addModuleDependencies方法，用于向给定的模块添加依赖。  
// 它接收五个参数：module（要添加依赖的模块）、dependencies（依赖数组）、bail（是否立即停止编译）、cacheGroup（缓存组）和recursive（是否递归添加依赖）。  
// 最后一个参数callback是回调函数，用于在添加依赖完成时进行回调。
 Compilation.prototype.addModuleDependencies = function(module, dependencies, bail, cacheGroup, recursive, callback) {
  // 根据依赖数组(dependencies)创建依赖模块对象
  var factories = []; // 用于存储依赖模块的工厂对象
  for (var i = 0; i < dependencies.length; i++) { // 为每个依赖创建一个工厂对象并存储到factories数组中。
    var factory = _this.dependencyFactories.get(dependencies[i][0].constructor); // 获取对应的模块工厂
    factories[i] = [factory, dependencies[i]]; // 将工厂对象和依赖项一起存储到factories数组中。  
  }
  ...
  // 与当前模块构建步骤相同
}
```

### 构建细节

​        module是webpack构建的核心实体,也是所有module的父类,它有几种不同子类：NormalModule，MultiModule，ContextModule，DelegatedModule 等。但这些核心实体都是在构建中都会去调用对应方法，也就是模块构建函数build()。

> 它主要完成了以下几件事情：
> ①初始化模块信息：设置模块的构建时间戳，并标记模块为已构建。
> ②检查是否需要跳过解析：如果提供了module.noParse选项，并且是字符串或正则表达式数组，代码会检查当前模块的请求是否匹配其中的某个模式。如果匹配，则直接返回回调，不进行后续解析操作。
> ③解析源代码：使用acorn库解析模块的源代码，生成抽象语法树（AST）。
> ④错误处理：如果在解析过程中发生错误，代码会捕获异常，获取源代码内容，清空源代码引用，并抛出一个包含错误信息和源代码内容的ModuleParseError异常。
> ⑤返回回调：如果一切正常，或者在跳过解析的情况下，函数会返回回调。

​        对于每一个module，它都会有这样一个构建方法build()。当然，它还包括了从构建到输出的一系列的有关module生命周期的函数，我们通过module父类类图其子类类图(这里以NormalModule为例)来观察其真实形态：

![image-20240413162854368](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162854368.png)

可以看到，无论是构建流程，处理依赖流程，还是后面的封装流程都是与module密切相关的。

# 三、打包输出流程

## seal 输出资源

​        在所有模块及其依赖模块编译(build)完成后，webpack会触发一个名为seal的生命周期事件,这个事件标志着构建过程的结束，并且webpack将开始对构建后的结果进行封装。在seal事件触发后，webpack会逐个对每个module和chunk进行整理，这个阶段的目标是生成编译后的源码，进行合并、拆分以及生成hash。

​     seal方法主要是生成chunks，对chunks进行一系列的优化操作，并生成要输出的代码。webpack中的chunk，可以理解为配置在entry中的模块，或者是动态引入的模块，根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表。

> 当seal事件被触发时，Webpack会执行以下操作：
> 1.调用插件的seal方法：Webpack会通知所有已注册的插件，构建过程已经完成，并可以开始执行自定义的seal方法。这允许插件对构建后的结果进行自定义处理或添加额外的元数据。
> 2.整理模块和chunks：Webpack会对所有模块和chunks进行整理，确保它们按照正确的顺序排列。这包括根据模块的依赖关系进行排序，以及合并和拆分代码块。
> 3.生成最终的assets：在整理完成后，Webpack会生成最终的assets，包括JavaScript、CSS、图片等文件。这些assets是构建过程的输出结果，可以直接部署到生产环境中使用。
> 4.触发其他插件事件：在seal事件被触发后，Webpack可能还会触发其他插件事件，例如optimize-tree等。这些事件允许插件执行进一步优化或其他自定义操作。
>         简而言之，seal事件是Webpack构建过程中的一个重要环节，它标志着构建过程的结束，并允许插件对构建后的结果进行封装和自定义处理。

​        同时这是我们在开发时进行代码优化和功能添加的关键环节。例如，可以利用seal事件对代码进行压缩、混淆或优化，以减少文件大小和提高性能。还可以使用插件来添加元数据、生成文档或执行其他与构建结果相关的任务。可以触发其他插件事件，如optimize-tree，以进一步优化模块和代码树的结构。这些优化可以提高应用程序的性能、减少加载时间并改善用户体验。

```javascript
// 定义Compilation对象的seal方法，该方法接受一个回调函数作为参数  
Compilation.prototype.seal = function seal(callback) {
  this.applyPlugins("seal");//调用并触发所有已注册的插件的seal事件。这允许插件执行一些自定义逻辑或操作  
  this.preparedChunks.sort(function(a, b) {//对已准备的chunks进行排序。排序的依据是chunk的名称。 
    if (a.name < b.name) {
      return -1;//如果名称a小于名称b，则返回-1；
    }
    if (a.name > b.name) {
      return 1;//如果名称a大于名称b，则返回1；
    }
    return 0;//如果两者相等，则返回0 
  });
  // 遍历已排序的chunks，并对每个chunk执行以下操作：
  this.preparedChunks.forEach(function(preparedChunk) {
    var module = preparedChunk.module;//获取与当前chunk关联的模块 
    var chunk = this.addChunk(preparedChunk.name, module);//向当前的chunks集合中添加一个新的chunk,chunk的名称为preparedChunk.name,并且与module关联  
    chunk.initial = chunk.entry = true;//设置新添加的chunk的一些属性:它是一个初始chunk,也是一个入口chunk 
    // 整理每个Module和chunk，每个chunk对应一个输出文件。将module添加到chunk中，并把chunk添加到module中。这表示module和chunk之间存在依赖关系
    chunk.addModule(module);
    module.addChunk(chunk);
  }, this);//使用bind确保回调函数中的this指向Compilation对象实例  
  //异步调用并触发所有已注册的插件的"optimize-tree"事件。这个事件允许插件对chunks和modules进行优化。优化完成后，会执行回调函数。
  this.applyPluginsAsync("optimize-tree", this.chunks, this.modules, function(err) {
    if (err) {
      return callback(err);//如果回调函数中发生错误，则将错误传递给外部的callback函数
    }
    ... // 触发插件的事件
    this.createChunkAssets(); //生成最终assets，可能包括JavaScript、CSS、图片等。生成的assets会被存储在compiler的assets属性中。
    ... // 触发插件的事件
  }.bind(this));// 使用bind确保回调函数中的this指向Compilation对象实例 
};// seal方法结束
```

### 生成最终 assets

​        在封装过程中，webpack会调用Compilation中的createChunkAssets方法进行打包后代码的生成。createChunkAssets函数通过收集和封装代码片段，将它们转化为可执行的模块，并将这些资源文件存储在compiler.assets对象中，以便后续的输出和引用。createChunkAssets流程如下：

![image-20240413162755972](C:\Users\陈冰仪191541102\AppData\Roaming\Typora\typora-user-images\image-20240413162755972.png)

> createChunkAssets的流程主要包括以下步骤：
> ①判断是否是入口chunk：createChunkAssets函数首先判断当前处理的chunk是否是入口chunk。如果是入口chunk，则使用MainTemplate进行封装，否则使用ChunkTemplate进行封装。
> ②处理依赖关系：在语法树解析阶段，createChunkAssets函数会收集文件的依赖关系，包括需要插入或替换的部分。
> ③生成代码片段：在generate阶段，createChunkAssets函数会生成各种代码片段，包括需要打包输出的资源。
> ④封装代码：createChunkAssets函数会对生成的代码片段进行收集和封装，将它们封装成可执行的模块。一旦代码片段被封装完毕，它们就会被存储在compiler.assets对象中。

## 输出最终文件（emit 输出完成）

​        在Webpack的打包过程中，createChunkAssets方法执行完毕后，会调用Compiler中的emitAssets()方法。所以最后一步是，webpack调用Compiler中的emitAssets()，将生成的代码输入到output的指定位置，完成最终文件的输出，从而webpack整个打包过程结束。

> output对象在Webpack配置中定义了输出目录、文件名等选项，emitAssets()方法会将生成的代码按照output配置的规则输出到相应的目录中。输出的文件可以是JavaScript、CSS、图片等资源文件，以及其他依赖图和其他元数据。（在确定好输出内容后，根据配置确定输出的路径和文件名）

​        值得注意的是，若想对结果进行处理，则需要在emitAssets()触发后对自定义插件进行扩展，可以通过编写自定义插件来实现。例如，可以编写一个自定义插件，并在emitAssets()触发后对生成的代码进行进一步处理或修改。在插件的apply方法中，可以访问compiler对象并监听emit事件。当emit事件触发时，可以执行自己的逻辑来处理生成的代码或资源。

​        在Compiler开始生成文件前，钩子emit会被执行，这是我们修改最终文件的最后一个机会，从而webpack整个打包过程则结束了。在emit事件发生时，代表源文件的转换和组装已经完成，可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。

> 具体来说，可以在插件中实现以下步骤：
> ①访问compiler对象并监听emit事件。
> ②在emit事件触发时，获取生成的代码或资源。
> ③对获取的代码或资源进行进一步处理或修改。
> ④如果你想将修改后的结果输出到文件系统，可以使用compiler.outputFileSystem来写入文件。
> ⑤完成处理后，你可以选择将修改后的结果重新赋值给compiler.assets对象，以便Webpack将其输出到指定的目录中。

# 构建方法

使用webpack 可以有两种方式：

①使用 webpack-cli 构建；

②使用 webpack 核心对象构建；

## 使用 webpack-cli 构建

1、安装依赖：在项目根目录下，打开终端并运行以下命令来安装webpack和webpack-cli

```bash
npm install --save-dev webpack webpack-cli
// --save-dev 参数的作用是将安装的包作为开发依赖添加到项目的package.json文件中。
// 这意味着这些包仅在开发过程中需要，而不是在生产环境中。
```

2、创建webpack.config.js文件：在项目根目录下创建一个名为webpack.config.js的文件。这个文件将包含构建配置。

3、配置文件内容：根据你的项目需求，你可以在webpack.config.js中设置各种配置项，例如入口文件、输出文件、加载器、插件等。下面是一个简单的示例：

```javascript
const path = require('path');  
  
module.exports = {  
  entry: './src/index.js',  
  output: {  
    path: path.resolve(__dirname, 'dist'),  
    filename: 'bundle.js',  
  },  
  module: {  
    rules: [  
      {  
        test: /\.js$/,  
        exclude: /node_modules/,  
        use: 'babel-loader',  
      },  
    ],  
  },  
  plugins: [],  
};
```

4、运行构建：在你的项目根目录下，运行以下命令来构建项目：

```bash
npx webpack --config webpack.config.js
```

5、启动开发服务器(可选)：如果想在开发过程中自动重新构建项目，可以使用webpack-dev-server。

- 首先，安装它：

```bash
npm install --save-dev webpack-dev-server
```

- 然后，在package.json中添加一个脚本来启动开发服务器：

```javascript
"scripts": {  
  "start": "webpack serve --open --config webpack.config.js"  
}
```

- 现在，可以通过运行npm start来启动开发服务器，并在浏览器中查看项目。当我们对代码进行更改时，服务器会自动重新构建和刷新浏览器。

## 使用 webpack 核心模块手动构建

​        如果不使用webpack CLI，可直接使用webpack的模块化API来手动构建项目。可以通过Node.js的require()函数来手动导入webpack和webpack配置文件，并使用webpack的API进行构建。

1、首先，确保已经安装了webpack和webpack-core。

```javascript
npm install webpack webpack-core --save-dev
//在Webpack的构建流程中，Webpack-core扮演着重要的角色，
//它负责解析入口文件，递归读取引入文件所依赖的文件内容，
//生成AST语法树，并根据AST语法树生成浏览器能够运行的代码。
```

2、然后，在需要使用webpack的JavaScript文件中，使用以下代码导入webpack：

```javascript
const webpack = require('webpack');
```

3、接下来，导入webpack配置文件。假设webpack配置文件名为webpack.config.js，使用以下代码将其导入：

```javascript
const config = require('./webpack.config.js');
```

4、现在，可以使用webpack的API进行构建。

①以下是一个示例，展示了如何使用webpack进行构建：

- 引入webpack：const webpack = require('webpack')；
- 调用 webpack 并传入配置参数，webpack 将返回一个编译对象；
- 调用编译对象的 run 方法，run 方法将执行编译。

```javascript
// 导入webpack模块，这样我们就可以使用webpack的API进行构建  
const webpack = require('webpack');  
//【const path = require('path');】
//【const fs = require('fs');】

// 导入我们的webpack配置文件。这个文件包含了webpack如何处理我们的项目的所有信息  
const config = require('./webpack.config.js');  //*****读取webpack配置文件*****
//【const config = JSON.parse(fs.readFileSync('webpack.config.js', 'utf8'));】 
  
// 使用webpack的API执行构建过程。这里的config是我们之前导入的webpack配置  
const compiler = webpack(config);  //*****创建webpack实例*****
// 运行编译实例。编译实例执行后，会调用回调函数，将错误（如果有的话）和构建统计信息作为参数传入  
compiler.run((err, stats) => {  //*****编译入口文件*****  
  // 当构建过程完成时，回调函数会被调用。如果构建过程中出现错误，err会被赋值。stats对象包含了构建过程中的各种信息  
  if (err || stats.hasErrors()) {  
    // 如果err或stats.hasErrors()返回true，说明构建过程中出现了错误，我们将其打印出来  
    console.error('编译出错:', err);  
  } else {  
    // 如果构建过程没有错误，我们打印一条成功消息  
    console.log('编译完成:', stats.toString({ colors: true }));    
  }  
});
```

​        在这个示例中，我们首先使用require()函数导入webpack和path模块。然后，我们使用fs模块读取webpack.config.js配置文件，并将其解析为JSON对象。接下来，我们创建一个webpack实例，并将配置文件传递给它。最后，我们调用compiler.run()方法来执行编译过程。

- 使用compiler.run()可启动编译过程，使用compiler.watch()可监视文件变化并自动编译。

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

​        在上面的示例中，webpack(config, callback)函数用于执行构建。config参数是要使用的webpack配置对象，callback参数是一个回调函数，在构建完成后被调用。如果构建过程中出现错误或警告，它们将作为回调函数的参数传递给err和stats。我们可以根据需要进行错误处理或输出构建结果。

5、运行Webpack: 在命令行终端中，运行以下命令来执行Webpack：

```bash
npx webpack --config webpack.config.js
```

- 可以在项目的根目录下创建一个package.json文件（如果还没有的话），并添加以下内容：

```javascript
{  
  "name": "my-webpack-project",  
  "version": "1.0.0",  
  "scripts": {  
    "build": "webpack --config webpack.config.js" // 添加一个构建脚本  
  },  
  "devDependencies": {  
    "webpack": "^5.0.0", // 指定Webpack的版本号，根据实际情况进行调整  
  }  
}
```

- 在命令行终端中，运行以下命令来构建项目

```bash
npm run build // 使用npm命令构建项目
```

6、启动开发服务器(可选)：

- 首先，确保你已经安装了 webpack 和 webpack-dev-server。

```bash
npm install --save-dev webpack webpack-dev-server
```

- 在项目 webpack.config.js 文件中添加以下内容

```javascript
const path = require('path');  
  
module.exports = {  
  entry: './src/index.js', // 指定入口文件  
  output: {  
    path: path.resolve(__dirname, 'dist'), // 指定输出目录  
    filename: 'bundle.js', // 指定输出文件名  
  },  
  devServer: {  
    contentBase: './dist', // 指定服务器响应的静态资源目录  
    port: 3000, // 指定服务器监听的端口号  
  },  
};
```

- 可以在项目的根目录下创建一个 package.json 文件（如果还没有的话），并添加以下内容

```javascript
{  
  "name": "my-webpack-project",  
  "version": "1.0.0",  
  "scripts": {  
    "start": "webpack serve --open" // 添加一个启动脚本  
  },  
  "devDependencies": {  
    "webpack": "^5.0.0", // 指定 webpack 的版本号，根据实际情况进行调整  
    "webpack-dev-server": "^3.11.0" // 指定 webpack-dev-server 的版本号，根据实际情况进行调整  
  }  
}
```

- 打开终端，进入项目根目录，并运行以下命令启动开发服务器

```bash
npm start // 使用 npm 命令启动服务器
```