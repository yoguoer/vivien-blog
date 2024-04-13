---
title: Module的语法和加载实现
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - JavaScript
---

## 1、概述

​        ES6模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系以及输入和输出的变量，CommonJS和AMD模块都只能在运行时确定这些东西。

> 模块功能主要由两个命令构成：export和import。
> export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。

​        ES6模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。可以在编译时就完成模块加载，这使得静态分析成为可能。有了它，就能进一步拓宽JavaScript的语法。

```javascript
// ES6模块。实质是从fs模块加载3个方法，其他方法不加载。这种加载称为编译时加载或静态加载
import { stat, exists, readFile } from 'fs';
```

除了静态加载带来的各种好处，ES6模块还有以下好处。

- 无需UMD模块格式，将来服务器和浏览器都会支持ES6模块格式。目前，通过各种工具库，其实已经做到了这一点。
- 将来浏览器的新API就能用模块格式提供，不再必须做成全局变量或者navigator对象的属性。
- 不再需要对象作为命名空间(比如Math对象)，未来这些功能可以通过模块提供。

## 2、import()

​        import命令会被JS引擎静态分析，先于模块内的其他语句执行(import命令叫做连接binding其实更合适)。import和export命令只能在模块的顶层，不能在代码块中(比如在if代码块中，或在函数中)。这样的设计有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载不可能实现。

​        import()函数支持动态加载模块。import()返回一个Promise对象。import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。import()类似于Node的require方法，区别主要是前者是异步加载，后者是同步加载。

​         下面是import()的一些适用场合:

- 按需加载。import()可以在需要的时候再加载某个模块。

```javascript
button.addEventListener('click', event => { //只有用户点击了按钮才会加载这个模块
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});
```

- 条件加载。import()可以放在if代码块，根据不同的情况加载不同的模块。

```javascript
if (condition) { //如果满足条件就加载模块 A，否则加载模块 B
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
```

- 动态的模块路径。import()允许模块路径动态生成。

```javascript
import(f()) //根据函数f的返回结果加载不同的模块
.then(...);
```

​        注意点：

- import()加载模块成功以后，这个模块会作为一个对象当作then方法的参数。因此，可以使用对象解构赋值的语法获取输出接口。

```javascript
import('./myModule.js')
.then(({export1, export2}) => { //export1和export2都是myModule.js的输出接口，可以解构获得
  // ...·
});
```

- 如果模块有default输出接口，可以用参数直接获得。

```javascript
import('./myModule.js')
.then(myModule => {
  console.log(myModule.default);
});
//也可以使用具名输入的形式
import('./myModule.js')
.then(({default: theDefault}) => {
  console.log(theDefault);
});
//如果想同时加载多个模块，可以采用下面的写法
Promise.all([
  import('./module1.js'),
  import('./module2.js'),
  import('./module3.js'),
])
.then(([module1, module2, module3]) => {
   ···
});
```

- import()也可以用在async函数之中。

```javascript
async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main();
```

## 3、严格模式

​         ES6的模块自动采用严格模式，不管有没有在模块头部加上"use strict"。主要有以下限制。

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用with语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀 0 表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
- eval不会在它的外层作用域引入变量
- eval和arguments不能被重新赋值
- arguments不会自动反映函数参数的变化
- 不能使用arguments.callee
- 不能使用arguments.caller
- 禁止this指向全局对象
- 不能使用fn.caller和fn.arguments获取函数调用的堆栈
- 增加了保留字（比如protected、static和interface）

​        尤其注意this的限制。ES6模块中，顶层的this指向undefined，即不应该在顶层代码使用this。

## 4、export 命令

​        一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量。

​        export命令除了输出变量，还可以输出函数或类(class)。

​        通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名。

​        需要特别注意的是，export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

```javascript
// 写法一
export var m = 1;
// 写法二
var m = 1;
export {m};
// 写法三
var n = 1;
export {n as m};
// 报错
function f() {}
export f;
// 正确
export function f() {};
// 正确
function f() {}
export {f};
```

​          export语句输出的接口与其对应的值是动态绑定关系，即通过该接口可以取到模块内部实时的值。

```javascript
export var foo = 'bar'; //输出变量foo，值为bar
setTimeout(() => foo = 'baz', 500); //500毫秒之后变成baz
```

​          export命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错。这是因为处于条件代码块中，就没法做静态优化了，违背了ES6模块的设计初衷。

## 5、import 命令

​        使用export命令定义了模块的对外接口以后，其他JS文件就可以通过import命令加载这个模块。

​        import命令接受一对大括号，里面指定要从其他模块导入的变量名，大括号里面的变量名必须与被导入模块对外接口的名称相同。

​        如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名。

​        import命令输入的变量都是只读的，因为它的本质是输入接口，不允许在加载模块的脚本里面改写接口。建议凡是输入的变量，都当作完全只读，不要轻易改变它的属性。

​        import后面的from指定模块文件的位置，可以是相对路径，也可以是绝对路径，.js后缀可以省略。如果只是模块名，不带有路径，那么必须有配置文件，告诉JavaScript引擎该模块的位置。

​        注意，import命令具有提升效果，会提升到整个模块的头部首先执行。

​       import在静态解析阶段执行，所以它是一个模块之中最早执行的，所以不能使用表达式、变量和if结构等，这些只有在运行时才能得到结果的语法结构。

```javascript
// 报错
import { 'f' + 'oo' } from 'my_module';
// 报错
let module = 'my_module';
import { foo } from module;
// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

​        import语句会执行所加载的模块，如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。

## 6、模块的整体加载

​        除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。注意，模块整体加载所在的那个对象应该是可以静态分析的，所以不允许运行时改变。

```javascript
import * as circle from './circle'; //整体加载
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};
```

## 7、export default 命令

​        export default命令用于为模块指定默认输出。显然，一个模块只能有一个默认输出，因此export default命令只能使用一次，所以import命令后面才不用加大括号，因为只可能唯一对应export default命令。export default也可以用来输出类。

​        例如，一个模块文件默认输出一个匿名函数，那么其他模块加载该模块时，import命令可以为该匿名函数指定任意名字，这时就不需要知道原模块输出的函数名。export default命令用在非匿名函数前也是可以的。需要注意的是，这时import命令后面不使用大括号。

```javascript
// 第一组。使用export default时，对应的import语句不需要使用大括号
export default function crc32() { // 输出
  // ...
}
import crc32 from 'crc32'; // 输入
// 第二组。不使用export default时，对应的import语句需要使用大括号。
export function crc32() { // 输出
  // ...
};
import {crc32} from 'crc32'; // 输入
```

​          本质上，export default就是输出一个叫default的变量或方法，然后系统允许为它取任意名字，并且它后面不能跟变量声明语句。

```javascript
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;
// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
//正因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句
// 正确
export var a = 1;
// 正确
var a = 1;
export default a; //将变量a的值赋给变量default
// 错误
export default var a = 1;
```

​        因为export default命令的本质是将后面的值赋给default变量，所以可以直接将一个值写在export default之后。

```javascript
// 正确
export default 42;
// 报错
export 42; //没有指定对外的接口
```

​        有了export default命令，输入模块时就非常直观了。

```javascript
import _ from 'lodash';//输入 lodash 模块
import _, { each, forEach } from 'lodash'; //如果想在一条import语句中同时输入默认方法和其他接口
```

## 8、export 与 import 的复合写法

​        如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。

```javascript
export { foo, bar } from 'my_module'; //写成一行后，foo和bar实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar
// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
//模块的接口改名和整体输出，也可以采用这种写法。--------------------------------------
// 接口改名
export { foo as myFoo } from 'my_module';
// 整体输出
export * from 'my_module';
//默认接口的写法如下。------------------------------------------------------------
export { default } from 'foo';
//具名接口改为默认接口的写法如下。--------------------------------------------------
export { es6 as default } from './someModule';
// 等同于
import { es6 } from './someModule';
export default es6;
//同样地，默认接口也可以改名为具名接口。---------------------------------------------
export { default as es6 } from './someModule';
//之前，有一种import语句没有对应的复合写法，ES2020补上了这个写法。---------------------
export * as ns from "mod";
// 等同于
import * as ns from "mod";
export {ns};
```

## 9、模块的继承

​        模块之间也可以继承。注意，export *命令并不会导出从其他模块导入的 default 导出项。因为 export * 只导出那些被明确标记为导出的项，而默认导出并不属于这种情况，它在每个模块中只能有一个，并且它并不需要一个明确的导出名称。

## 10、跨模块常量

​        如果想设置跨模块的常量(即跨多个文件)，或者说一个值要被多个模块共享，可以采用下面的写法。

```javascript
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;
// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3
// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3
```

​       如果要使用的常量非常多，可以建一个专门的constants目录，将各种常量写在不同的文件里面，保存在该目录下。然后将这些文件输出的常量合并在index.js里面。使用时，直接加载index.js就可以了。

```javascript
// constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};
// constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];
// constants/index.js
export {db} from './db';
export {users} from './users';
// script.js
import {db, users} from './constants/index';
```

## Module 的加载实现

## 1、浏览器加载

### 传统方法

- 默认方法：通过<script>标签加载JavaScript脚本，默认是同步加载执行的。渲染引擎如果遇到<script>就会停下来，直到脚本下载执行完成，才会继续渲染。如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器卡死了，没有任何响应。
- 异步方法：包括defer和async属性。其中，defer属性会让该标签引用的脚本等到整个页面在内存中正常渲染结束(DOM结构完全生成，以及其他脚本执行完成)，才会执行，并且引用的其他脚本执行完成之后，才会执行；多个defer脚本会按照它们在页面上出现的顺序依次执行。而async属性则类似于异步回调函数，一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染；多个async脚本不能保证执行的顺序。

### 加载规则

- 浏览器加载ES6模块也使用<script>标签，但是要加入type="module"属性。
- 浏览器对于带有type="module"的<script>都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完再执行模块脚本，等同于打开了<script>标签的defer属性。
- 如果网页有多个<script type="module">，它们会按照在页面出现的顺序依次执行。
- <script>标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后再恢复渲染。
- 一旦使用了async属性，<script type="module">就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。
- ES6模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致。

对于外部的模块脚本（上例是foo.js），有几点需要注意。

- 代码是在模块作用域中运行，而不是在全局作用域运行。模块内部的顶层变量外部不可见。
- 模块脚本自动采用严格模式，不管有没有声明use strict。
- 模块中可以使用import命令加载其他模块(.js后缀不可省略，需要提供绝对 URL 或相对 URL)，也可以使用export命令输出对外接口。
- 模块中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字是无意义的。
- 同一个模块如果加载多次，将只执行一次。

​        利用顶层的this等于undefined这个语法点，可以侦测当前代码是否在 ES6 模块中。

```javascript
const isNotModuleScript = this !== undefined;
```

## 2、ES6 模块与 CommonJS 模块的差异

​        ES6模块与CommonJS模块有两个重大差异。

- CommonJS模块输出的是一个值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值，原始值会被缓存，除非写成一个函数才能得到内部变动后的值。ES6模块输出的是值的引用。
- CommonJS模块是运行时加载，ES6模块是编译时输出接口。因为CommonJS加载的是一个对象(即module.exports属性)，该对象只有在脚本运行完才会生成。而ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
- import命令加载CommonJS模块只能整体加载，不能只加载单一的输出项。
- ES6模块的运行机制与CommonJS不一样。JS引擎对脚本静态分析时，遇到模块加载命令import就会生成一个只读引用，等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6的import有点像Unix系统的符号连接，原始值变了，import加载的值也会跟着变。因此，ES6模块是动态引用(动态地去被加载的模块取值)，并且不会缓存值(运行结果)，模块里面的变量绑定其所在的模块。
- ES6输入的模块变量只是一个符号连接，所以这个变量是只读的，对它进行重新赋值会报错。export通过接口输出的是同一个值。不同的脚本加载这个接口得到的都是同样的实例。

> package.json文件中，
>         main字段指定CommonJS入口给Node.js 使用。当你使用require() 导入一个模块时，Node.js 会查找package.json文件中的main字段来确定要加载哪个文件。如果main字段不存在或指定的文件不存在，Node.js会尝试加载index.js或index.node文件。
>         module字段指定ES6模块入口给打包工具使用，因为Node.js不认识module字段。当使用require()导入一个模块时，Node.js会查找package.json文件中的main字段来确定要加载哪个文件。如果main字段不存在或指定的文件不存在，Node.js会尝试加载index.js或index.node文件。
>     这样允许库或框架的维护者同时提供CommonJS和ES6版本的代码，满足不同用户的需求。例如，Node.js用户可以继续使用require()语法，而前端开发者可通过打包工具享受ES6模块带来的优势。

```javascript
{  
  "name": "my-package",  
  "version": "1.0.0",  
  "main": "dist/index.cjs.js",  // CommonJS 入口  
  "module": "dist/index.esm.js", // ES6 模块入口  
  // 其他配置...  
}
```

## 3、Node.js 的模块加载方法

​       Node.js要求ES6模块采用.mjs后缀文件名。就是说，只要脚本文件里使用import或export命令，那么就必须采用.mjs后缀名。Node.js遇到.mjs文件，就认为它是ES6模块，默认启用严格模式，不必在每个模块文件顶部指定"use strict"。如果不希望将后缀名改成.mjs，可以在项目的package.json文件中指定type字段为module。一旦设置了以后，该目录里面的JS脚本就被解释成ES6模块。

​       如果这时还要使用CommonJS模块，那么需要将CommonJS脚本的后缀名都改成.cjs。如果没有type字段，或者type字段为commonjs，则.js脚本会被解释成CommonJS模块。

​        总结为一句话：.mjs文件总是以ES6模块加载，.cjs文件总是以CommonJS模块加载，.js文件的加载取决于package.json里面type字段的设置。

​        注意，ES6模块与CommonJS模块尽量不要混用。require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。反过来，.mjs文件里面也不能使用require命令，必须使用import。

main 字段

​     package.json文件有两个字段可以指定模块的入口文件：main和exports。比较简单的模块可以只使用main字段指定模块加载的入口文件。要加上 "type": "module"，否则会被解释为CommonJS模块。

exports 字段

​        exports字段的优先级高于main字段。它有多种用法。

子目录别名：package.json文件的exports字段可以指定脚本或子目录的别名。如果没有指定别名，就不能用“模块+脚本名”这种形式加载脚本。

```javascript
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./submodule": "./src/submodule.js"
  }
}//上面的代码指定src/submodule.js别名为submodule，然后就可以从别名加载这个文件。
import submodule from 'es-module-package/submodule';
// 加载 ./node_modules/es-module-package/src/submodule.js
```

main的别名：exports字段的别名如果是.，就代表模块的主入口，优先级高于main字段，且可直接简写成exports字段的值。exports只有支持ES6的Node.js才认识，所以可用来兼容旧版本的Node.js。

```javascript
{
  "exports": {
    ".": "./main.js"
  }
}
// 等同于
{
  "exports": "./main.js"
}
//老版本的Node.js(不支持ES6模块)的入口文件是main-legacy.cjs，新版本的Node.js的入口文件是main-modern.cjs
{
  "main": "./main-legacy.cjs",
  "exports": {
    ".": "./main-modern.cjs"
  }
}
```

条件加载：利用.这个别名，可以为ES6模块和CommonJS指定不同的入口。目前，这个功能需要在Node.js运行的时候，打开--experimental-conditional-exports标志。

```javascript
{
  "type": "module",
  "exports": {
    ".": {
      "require": "./main.cjs", //指定require()命令的入口文件（即CommonJS的入口）
      "default": "./main.js"   //指定其他情况的入口（即ES6的入口）
    }
  }
}//上面的写法可以简写如下
{
  "exports": {
    "require": "./main.cjs",
    "default": "./main.js"
  }
}//注意，如果同时还有其他别名，就不能采用简写，否则或报错
{
  // 报错
  "exports": {
    "./feature": "./lib/feature.js",
    "require": "./main.cjs",
    "default": "./main.js"
  }
}
```

ES6 模块加载 CommonJS 模块

​        ES6模块通过Node.js内置的module.createRequire()方法可以加载CommonJS模块。

```javascript
// cjs.cjs
module.exports = 'cjs';
// esm.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjs = require('./cjs.cjs');
cjs === 'cjs'; // true
```

CommonJS 模块加载 ES6 模块

​        CommonJS的require命令不能加载ES6模块，会报错，只能使用import()这个方法加载。

```javascript
(async () => {
  await import('./my-app.mjs');
})();
```

Node.js 的内置模块

​        Node.js的内置模块可以整体加载，也可以加载指定的输出项。

```javascript
// 整体加载
import EventEmitter from 'events';
const e = new EventEmitter();
// 加载指定的输出项
import { readFile } from 'fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```

加载路径

​    ES6模块的加载路径必须给出脚本的完整路径，不能省略脚本的后缀名。import命令和package.json文件的main字段如果省略脚本的后缀名，会报错。

```javascript
// ES6 模块中将报错
import { something } from './index';
```

​        为了与浏览器的import加载规则相同，Node.js 的.mjs文件支持 URL 路径。同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存。所以，只要文件名中含有:、%、#、?等特殊字符，最好对这些字符进行转义。

```javascript
import './foo.mjs?query=1'; // 加载 ./foo 传入参数 ?query=1 
//脚本路径带有参数?query=1，Node会按URL规则解读
```

​        目前，Node.js 的import命令只支持加载本地模块(file:协议)和data:协议，不支持加载远程模块。脚本路径只支持相对路径，不支持绝对路径(即以/或//开头的路径)。Node的import命令是异步加载，这一点与浏览器的处理方法相同。

内部变量

​        ES6模块应该是通用的，同一个模块不用修改就可以用在浏览器环境和服务器环境。为了达到这个目标，Node规定ES6模块中不能使用CommonJS模块的特有的一些内部变量。

​         this关键字。ES6模块的顶层this指向undefined；CommonJS模块的顶层this指向当前模块，这是两者的一个重大差异。

​        以下这些顶层变量在ES6模块中都是不存在的。

- arguments
- require
- module
- exports
- __filename
- __dirname

## 4、循环加载

​        循环加载指的是a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本。通常，循环加载表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现。模块加载机制必须考虑循环加载的情况。

​       对于JavaScript语言来说，目前最常见的两种模块格式CommonJS和ES6处理循环加载的方法是不一样的，返回的结果也不一样。

CommonJS 模块的加载原理

​        CommonJS的一个模块就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。以后需要用到这个模块的时候，就会到exports属性上面取值。即使再次执行require命令也不会再次执行该模块，而是到缓存中取值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。

CommonJS 模块的循环加载

​        CommonJS模块的重要特性是加载时执行，即脚本代码在require的时候就会全部执行。一旦出现某个模块被循环加载，就只输出已经执行的部分，还未执行的部分不会输出。CommonJS输入的是被输出值的拷贝，不是引用。由于CommonJS模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。所以，输入变量的时候必须非常小心。

ES6 模块的循环加载

​        在ES6模块中，如果一个模块A导入另一个模块B，而模块B又导入了模块A，系统将尝试解析这些依赖。但与CommonJS不同的是，ES6模块不会返回一个部分初始化的模块对象。相反，它会确保每个模块的代码都完全执行一次，然后再将导出的值提供给其他模块。ES6 模块是动态引用，如果用import从一个模块加载变量，那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证真正取值的时候能够取到值。