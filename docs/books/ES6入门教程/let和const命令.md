---
title: let和const命令
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - JavaScript
---

## let命令

- 不存在变量提升

var会变量提升，而let只在命令所在的代码块内有效。需要先声明后使用

```javascript
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

- 暂时性死区

​          只要块级作用域内存在let命令，它所声明的变量就绑定(binding)这个区域，不再受外部的影响。

```javascript
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
//上面代码中，存在全局变量tmp，但是块级作用域内let又声明了一个局部变量tmp
//导致后者绑定这个块级作用域，所以在let声明变量前，对tmp赋值会报错
```

​        在代码块内，使用let命令声明变量之前，该变量都是不可用的，这在语法上，称为暂时性死区。ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

```javascript
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError
  let tmp; // TDZ结束
  console.log(tmp); // undefined
  tmp = 123;
  console.log(tmp); // 123
}
```

- 不允许重复声明

​        let不允许在相同作用域内重复声明同一个变量。因此，不能在函数内部重新声明参数。

```javascript
function func(arg) {
  let arg;
}
func() // 报错
//在这个例子中,arg是一个函数参数，因此在函数体内它已经被声明了
//当你尝试再次使用let声明一个同名的变量时,会抛出一个语法错误，因为arg已经被声明过了
function func(arg) {
  {
    let arg;
  }
}
func() // 不报错
//在这个例子中,尽管函数参数arg已被声明，但在新的块级作用域{}内部，可以使用let重新声明一个名为arg的变量
//这个新的arg变量只在这个块级作用域内可见，不会与外部的arg冲突。因此，这个函数不会报错
```

- 在第一个例子中，尝试在同一个作用域内重复声明arg，导致语法错误。
- 在第二个例子中，在一个新的块级作用域内声明了arg，这是允许的，因为这个新的arg只在其所在的块内可见。

## 块级作用域

​        ES5只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景:

- 第一种场景，内层变量可能会覆盖外层变量。
- 第二种场景，用来计数的循环变量泄露为全局变量。

​        let实际上为JavaScript新增了块级作用域。外层代码块不受内层代码块的影响。允许块级作用域的任意嵌套，每一层都是一个单独的作用域，内层作用域可以定义外层作用域的同名变量，块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了。

- 块级作用域与函数声明
  - ES5规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。
  - ES6引入了块级作用域，明确允许在块级作用域之中声明函数，并规定块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。
  - 为了减轻不兼容性问题，ES6的浏览器的实现可以不遵守上面的规定，有自己的行为方式。①允许在块级作用域内声明函数。②函数声明类似于var，即会提升到全局作用域或函数作用域的头部。③函数声明会提升到所在的块级作用域的头部。（注意，上面三条规则只对ES6的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作let处理。根据这三条规则，浏览器的ES6环境中，块级作用域内声明的函数，行为类似于var声明的变量。）

​        考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

```javascript
// 块级作用域内部的函数声明语句，建议不要使用
{
  let a = 'secret';
  function f() {
    return a;
  }
}
// 块级作用域内部，优先使用函数表达式
{
  let a = 'secret';
  let f = function () {
    return a;
  };
}
```

​          ES6的块级作用域必须有大括号，如果没有大括号，JavaScript引擎就认为不存在块级作用域。函数声明也是如此，严格模式下，函数只能声明在当前作用域的顶层。

```javascript
// 第一种写法，没有大括号，所以不存在块级作用域，而let只能出现在当前作用域的顶层，所以报错。
if (true) let x = 1;
// 第二种写法，有大括号，所以块级作用域成立，不报错。
if (true) {
  let x = 1;
}
// 不报错，函数声明必须总是出现在其所在作用域的顶部，或者被包含在一个块级作用域中。
'use strict';
if (true) {
  function f() {}
}
// 报错，试图在一个非块级作用域(即if语句后面的单行)中声明一个函数，没有被包含在任何块级作用域内
'use strict';
if (true)
  function f() {}
```

##  const命令

​       const声明一个只读的常量。一旦声明，常量的值就不能改变，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。对于const来说，只声明不赋值，就会报错。

```javascript
const foo; 
// SyntaxError: Missing initializer in const declaration  只声明不赋值，就会报错
const PI = 3.1415;
PI // 3.1415  
PI = 3;
// TypeError: Assignment to constant variable.  改变常量的值会报错
```

- 块级作用域、变量不提升、暂时性死区、不允许重复声明

​       const的作用域与let命令相同，只在声明所在的块级作用域内有效。const命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用。const声明的常量也与let一样不可重复声明。

- 本质

​         const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。

```javascript
//常量foo储存的是一个地址，这个地址指向一个对象。
const foo = {};
//不可变的只是这个地址，即不能把foo指向另一个地址，
//但对象本身是可变的，所以依然可以为其添加新属性。
foo.prop = 123;// 为 foo 添加一个属性，可以成功
foo.prop // 123
// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
const a = []; //常量a是一个数组，这个数组本身是可写的,但如果将另一个数组赋值给a，就会报错。
a.push('Hello'); // 可执行
a.length = 0;    // 可执行
a = ['Dave'];    // 报错
```

​        如果真的想将对象冻结，应使用Object.freeze方法。除了将对象本身冻结，对象的属性也应冻结。

```javascript
const foo = Object.freeze({});//指向一个冻结对象,所以添加新属性不起作用，严格模式时还会报错。
// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
//下面是一个将对象彻底冻结的函数。
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```

## ES6声明变量的六种方法

​        ES6 声明变量的方法有六种，分别是 var、let、const、function、import 和 class。

- var：用于声明变量，可以修改，如果不初始化会输出 undefined，不会报错。变量作用域为全局或函数级。
- let：用于声明块级作用域变量，其作用域只在 let 命令所在的代码块内有效。不存在变量提升，必须在声明后使用，否则报错。存在暂时性死区，只能在声明的位置后面使用。不可重复声明。
- const：用于声明常量，一旦声明，常量的值就不能改变。不存在变量提升，必须立即初始化，否则会报错。其作用域为块级作用域，只在同一作用域内不能重复声明。
- function：用于声明函数或方法内部的变量。
- import：用于导入模块或库中的变量、函数等。
- class：用于声明类或对象。

## 顶层对象

​        顶层对象，在浏览器环境指的是window对象，在Node指的是global对象。

​        ES5中，顶层对象的属性与全局变量是等价的。

​        ES6一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let、const、class声明的全局变量不属于顶层对象的属性。

```javascript
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1
let b = 1;
window.b // undefined
```

## globalThis 对象

​        JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

- 浏览器里面，顶层对象是window，但Node和Web Worker没有window。
- 浏览器和Web Worker里面，self也指向顶层对象，但是Node没有self。
- Node里面，顶层对象是global，但其他环境都不支持。

​        同一段代码为了能够在各种环境都能取到顶层对象，现在一般是使用this关键字，在不同的环境(例如浏览器和Node.js)以及不同的运行模式下(严格模式和非严格模式)，this 的行为可能会有所不同。

- 全局环境中，this会返回顶层对象(在浏览器中指window 对象；在Node.js中指global 对象)。但是，Node模块和ES6模块中，this返回的是当前模块。
- 函数里面的this，非严格模式下，如果函数不是作为对象的方法被调用，而是单纯作为函数运行，this会指向顶层对象。在严格模式下，this会返回undefined。
- 不管是严格模式，还是普通模式，new Function('return this')()总是会返回全局对象，因为在这里上下文中没有定义 this。但是，如果浏览器用了CSP(Content Security Policy内容安全策略)，那么eval、new Function这些方法都可能无法使用。

​        ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。垫片库global-this模拟了这个提案，可以在所有环境拿到globalThis。