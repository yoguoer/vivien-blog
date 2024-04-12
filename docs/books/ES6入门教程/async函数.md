---
title: async函数
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Note
tags:       # 标签
 - JavaScript
---

​        async函数就是Generator函数的语法糖。它可以让我们以同步的方式写异步代码，而不需要回调函数，可以通过async/await语法来实现异步操作。async函数完全可以看作多个异步操作包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖。

​        async函数就是将Generator函数的星号(*)替换成async，将yield替换成await，仅此而已。

​        async函数对Generator函数的改进体现在以下四点：

- 内置执行器。Generator函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。也就是说，async函数的执行与普通函数一模一样，只要一行。
- 更好的语义。async和await比起星号和yield，语义更清楚了。*\*async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。\*\**\***
- 更广的适用性。co模块约定，yield命令后面只能是Thunk函数或Promise对象，而async函数的await命令后面，可以是Promise对象和原始类型的值(数值、字符串和布尔值，但这时会自动转成立即resolved的Promise对象)。
- 返回值是 Promise。async函数的返回值是Promise对象，这比Generator函数的返回值是Iterator对象方便多了。可以用then方法指定下一步的操作。

## 1、基本用法

​        async函数返回一个Promise对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

```javascript
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}
asyncPrint('hello world', 50); //指定50毫秒以后输出hello world
//由于async函数返回的是Promise对象，可以作为await命令的参数。所以，上面的例子也可以写成下面的形式
async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}
asyncPrint('hello world', 50);
```

async函数有多种使用形式。

```javascript
// 函数声明
async function foo() {}
// 函数表达式
const foo = async function () {};
// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)
// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }
  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}
const storage = new Storage();
storage.getAvatar('jake').then(…);
// 箭头函数
const foo = async () => {};
```

## 2、语法

返回 Promise 对象

​        async函数返回一个Promise对象。

​        async函数内部return语句返回的值，会成为then方法回调函数的参数。

​        async函数内部抛出错误，会导致返回的Promise对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到。

```javascript
async function f() {
  return 'hello world'; //函数f内部return命令返回的值会被then方法回调函数接收到
}
f().then(v => console.log(v)) // "hello world"
//------------------------------------------------------------------------------
async function f() {
  throw new Error('出错了');
}
f().then(
  v => console.log(v),
  e => console.log(e)
)// Error: 出错了
```

Promise 对象的状态变化

​        async函数返回的Promise对象，必须等到内部所有await命令后面的Promise对象执行完才会发生状态改变，除非遇到return语句或者抛出错误。也就是说，只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。

await 命令

​       正常情况下，await命令后面是一个Promise对象，返回该对象的结果。如果不是Promise对象，就直接返回对应的值。另一种情况是，await命令后面是一个thenable对象(即定义了then方法的对象)，那么await会将其视为Promise对象。

```javascript
async function f() {
  // 等同于
  // return 123;
  return await 123;
}
f().then(v => console.log(v)) // 123
```

​     await命令后的Promise对象如果变为reject状态，reject的参数会被catch方法的回调函数接收到。

```javascript
async function f() {
  await Promise.reject('出错了');
}
f()
.then(v => console.log(v))
.catch(e => console.log(e)) 
// 出错了
//注意，上面代码中，await语句前面没有return，但是reject方法的参数依然传入了catch方法的回调函数。这里如果在await前面加上return，效果是一样的。
```

​        任何一个await语句后面的Promise对象变为reject状态，那么整个async函数都会中断执行。

```javascript
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行。因为第一个await语句状态变成了reject
}
```

​        有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行。另一种方法是await后面的Promise对象再跟一个catch方法，处理前面可能出现的错误。

```javascript
async function f() { 
  try {
    await Promise.reject('出错了'); //将第一个await放在try...catch结构里面
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}
f()
.then(v => console.log(v))
// hello world
//------------------------------------------------------------------------------
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e)); //await后面的Promise对象再跟一个catch方法
  return await Promise.resolve('hello world');
}
f()
.then(v => console.log(v))
// 出错了
// hello world
```

错误处理

​        如果await后面的异步操作出错，那么等同于async函数返回的Promise对象被reject。防止出错的方法，也是将其放在try...catch代码块中。如果有多个await命令，可以统一放在try...catch结构中。

```javascript
const superagent = require('superagent');
const NUM_RETRIES = 3;
async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try { //使用try...catch结构，实现多次重复尝试
      await superagent.get('http://google.com/this-throws-an-error');
      break;
    } catch(err) {}
  }
  console.log(i); // 3
}
test(); //如果await操作成功，就会使用break语句退出循环；如果失败，会被catch语句捕捉，然后进入下一轮循环
```

使用注意点

1. await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中。

```javascript
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}
// 另一种写法
async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  });
}
```

1. 多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。

```javascript
let foo = await getFoo();
let bar = await getBar();
//上面代码中，getFoo和getBar是两个独立的异步操作，被写成继发关系，这样比较耗时，因为只有getFoo完成以后才会执行getBar，
//完全可以让getFoo和getBar同时触发，这样就会缩短程序的执行时间-------------------------
// 写法一 
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
// 写法二 
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

1. await命令只能用在async函数之中，如果用在普通函数，就会报错。

```javascript
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  // 报错  因为await用在普通函数之中了
  docs.forEach(function (doc) {
    await db.post(doc); 
  });
}
//但是,如果将forEach方法的参数改成async函数,也有问题-----------------------------
function dbFuc(db) { //这里不需要 async
  let docs = [{}, {}, {}]; //这时三个db.post将是并发执行，即同时执行，而不是继发执行
  // 可能得到错误结果
  docs.forEach(async function (doc) {
    await db.post(doc);
  });
}
//正确的写法是采用for循环------------------------------------------------------
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  for (let doc of docs) {
    await db.post(doc);
  }
}
//另一种方法是使用数组的reduce方法----------------------------------------------
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  await docs.reduce(async (_, doc) => { //reduce方法的第一个参数是async函数，导致该函数的第一个参数是前一步操作返回的Promise对象，所以必须使用await等待它操作结束
    await _;
    await db.post(doc); 
  }, undefined); ////另外，reduce方法返回的是docs数组最后一个成员的async函数的执行结果，也是一个Promise对象，导致在它前面也必须加上await
}
```

1. async 函数可以保留运行堆栈。

```javascript
const a = async () => {
  await b();
  c();
}; //b()运行的时候，a()是暂停执行，上下文环境都保存着，一旦b()或c()报错，错误堆栈将包括a()
```

## 3、async 函数的实现原理

​        async函数的实现原理，就是将Generator函数和自动执行器包装在一个函数里。

```javascript
async function fn(args) {
  // ...
}
// 等同于
function fn(args) {
  return spawn(function* () {
    // ...
  });
} //所有的async函数都可以写成第二种形式，其中的spawn函数就是自动执行器。
```

## 4、与其他异步处理方法的比较

- Promise：虽然Promise的写法比回调函数的写法大大改进，但一眼看上去，代码完全都是Promise的API(then、catch等等)，操作本身的语义反而不容易看出来。
- Generator：语义比Promise写法更清晰，但它必须有一个任务运行器自动执行Generator函数。如果使用Generator写法，自动执行器需要用户自己提供。
-  Async：实现最简洁最符合语义，几乎没有语义不相关的代码。它将Generator写法中的自动执行器改在语言层面提供，不暴露给用户，因此代码量最少。

## 5、实例：按顺序完成异步操作

​        实际开发中，经常遇到一组异步操作需要按照顺序完成。我们可以用async函数实现。

```javascript
async function logInOrder(urls) {
  // 并发读取远程URL
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  }); //虽然map方法的参数是async函数，但它是并发执行的，因为只有async函数内部是继发执行，外部不受影响
  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  } //for..of循环内部使用了await，因此实现了按顺序输出。
}
```

## 6、顶层 await

​        允许在模块的顶层独立使用await命令，是为了更好地支持异步模块加载，使得异步操作更加简洁和直观。它保证只有等到异步操作完成，模块才会输出值。

​        顶层的await命令有点像交出代码的执行权给其他的模块加载，等异步操作完成后，再拿回执行权，继续向下执行。模块的使用者完全不用关心依赖模块的内部有没有异步操作，正常加载即可，这时，模块的加载会等待依赖模块的异步操作完成，才执行后面的代码，有点像暂停在那里。

​        下面是顶层await的一些使用场景：

```javascript
// import() 方法加载
const strings = await import(`/i18n/${navigator.language}`);
// 数据库操作
const connection = await dbConnector();
// 依赖回滚
let jQuery;
try {
  jQuery = await import('https://cdn-a.com/jQuery');
} catch {
  jQuery = await import('https://cdn-b.com/jQuery');
}
```

​        注意，如果加载多个包含顶层await命令的模块，加载命令是同步执行的。

```javascript
// x.js
console.log("X1");
await new Promise(r => setTimeout(r, 1000));
console.log("X2");
// y.js
console.log("Y");
// z.js 
import "./x.js";
import "./y.js";
console.log("Z"); 
//X1、Y、X2、Z。并没有等待x.js加载完成再去加载y.js。
```