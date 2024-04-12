---
title: Generator函数的语法和异步调用
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Note
tags:       # 标签
 - JavaScript
---

## 1、简介

​        语法上，Generator函数是一个状态机，封装了多个内部状态。执行Generator函数会返回一个遍历器对象，即Generator还是一个遍历器对象生成函数。返回的遍历器对象可以依次遍历Generator函数内部的每一个状态。

​        形式上，Generator函数是一个普通函数，但有两个特征。一是function关键字与函数名之间有一个星号；二是函数体内部使用yield表达式定义不同的内部状态(yield在英语里的意思就是产出)。

​        Generator函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用Generator函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象(Iterator Object)。每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式(或return语句)为止。换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。

### yield 表达式

​        由于Generator函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。

​        遍历器对象的next方法的运行逻辑如下。

（1）遇到yield表达式就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值作为返回的对象的value属性值。

（2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。

（3）如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。

（4）如果该函数没有return语句，则返回的对象的value属性值为undefined。

​        注意，yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为JavaScript提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。

### 与 Iterator 接口的关系

​         任意一个对象的Symbol.iterator方法等于该对象的遍历器生成函数，调用该函数会返回对象的一个遍历器对象。Generator就是遍历器生成函数，因此可以把Generator赋值给对象的Symbol.iterator属性，从而使得该对象具有Iterator接口。

## 2、含义

### Generator 与状态机

​        Generator是实现状态机的最佳结构。它可以不用外部变量保存状态，因为它本身就包含了一个状态信息，即目前是否处于暂停态。

```javascript
var clock = function* () {
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
}; //clock函数一共有两种状态（Tick和Tock），每运行一次就改变一次状态
```

### Generator 与协程

​        协程是一种程序运行的方式，可以理解成协作的线程或协作的函数，多个线程互相协作完成异步任务。协程既可以用单线程实现(特殊的子例程)，也可以用多线程实现(特殊的线程)。协程是以多占用内存为代价实现多任务的并行。同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态。协程是合作式的，执行权由协程自己分配。引入协程以后，每个任务可以保持自己的调用栈，抛出错误的时候可以找到原始的调用栈。最大优点是代码写法非常像同步操作，如果去除yield简直一模一样。

​        协程有点像函数，又有点像线程。它的运行流程大致如下。

- 第一步，协程A开始执行。
- 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
- 第三步，（一段时间后）协程B交还执行权。
- 第四步，协程A恢复执行。

​        上面流程的协程A就是异步任务，因为它分成两段（或多段）执行。

```javascript
function* asyncJob() {
  // ...其他代码
  var f = yield readFile(fileA);
  // ...其他代码
} //asyncJob是一个协程，它的奥妙就在其中的yield命令
//它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线。
//协程遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。
```

​        Generator函数是ES6对协程的实现，但属于不完全实现。Generator函数被称为半协程，意思是只有Generator函数的调用者，才能将程序的执行权还给Generator函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。如果将Generator函数当作协程，完全可以将多个需要互相协作的任务写成Generator函数，它们之间使用yield表达式交换控制权。

### Generator 与上下文

​        Generator函数执行产生的上下文环境，一旦遇到yield命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。等到对它执行next命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。

```javascript
function* gen() {
  yield 1;
  return 2;
}
let g = gen();
console.log(
  g.next().value, //第一次调用g.next()，Generator函数执行到yield 1，因此value 为 1
  g.next().value, //第二次调用g.next()，Generator函数执行到return 2，然后结束。
); 
```

## 3、应用

​        Generator可以暂停函数执行，返回任意表达式的值。这种特点使得Generator有多种应用场景。

### 异步操作的同步化表达

​        Generator函数可以暂停函数执行，因此，可以把异步操作写在yield表达式里面，等到调用next方法时再往后执行。实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在yield表达式下面，反正要等到调用next方法时再执行。所以，它可以用来处理异步操作，改写回调函数。

​        Ajax 是典型的异步操作，通过Generator函数部署Ajax操作，可以用同步的方式表达。

```javascript
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}
function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response); //makeAjaxCall函数中的next方法必须加上response参数，因为yield表达式本身是没有值的，总是等于undefined
  });
}
var it = main();
it.next();
```

### 控制流管理

​        如果有一个多步操作非常耗时，可以使用Generator函数改善代码运行流程。比如利用for...of循环会自动依次执行yield命令的特性，提供一种控制流管理的方法。

```javascript
let steps = [step1Func, step2Func, step3Func]; //数组steps封装了一个任务的多个步骤
function* iterateSteps(steps){
  for (var i=0; i< steps.length; i++){
    var step = steps[i];
    yield step();
  }
} //Generator函数iterateSteps则是依次为这些步骤加上yield命令
//将任务分解成步骤之后，还可以将项目分解成多个依次执行的任务
let jobs = [job1, job2, job3]; //数组jobs封装了一个项目的多个任务
function* iterateJobs(jobs){
  for (var i=0; i< jobs.length; i++){
    var job = jobs[i];
    yield* iterateSteps(job.steps);
  }
} //Generator函数iterateJobs则是依次为这些任务加上yield*命令
//最后，就可以用for...of循环一次性依次执行所有任务的所有步骤
for (var step of iterateJobs(jobs)){
  console.log(step.id);
} //注意！！！上面的做法只能用于所有步骤都是同步操作的情况，不能有异步操作的步骤
```

### 部署 Iterator 接口

​        利用Generator函数可以在任意对象上部署Iterator接口，即可以在任意对象上部署next方法。

```javascript
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
} //myObj是一个普通对象，通过iterEntries函数，就有了 Iterator 接口
let myObj = { foo: 3, bar: 7 };
for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}
// foo 3
// bar 7
```

### 作为数据结构

​        Generator可以看作是数据结构(数组结构)，因为Generator函数可以返回一系列的值，这意味着它可以对任意表达式提供类似数组的接口。Generator 使得数据或者操作具备了类似数组的接口。

## 4、next 方法的参数    

>  next方法的作用是分阶段执行Generator函数。每次调用next方法，会返回一个对象，表示当前阶段的信息(value属性和done属性)。value属性是yield语句后面表达式的值，表示当前阶段的值；done属性是一个布尔值，表示Generator函数是否执行完毕，即是否还有下一个阶段。

​     yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。Generator函数从暂停状态到恢复运行，它的上下文状态是不变的。通过next方法的参数，就有办法在Generator函数开始运行之后，继续向函数体内部注入值。也就是说，可以在Generator函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

```javascript
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
} //每次通过next方法向Generator函数输入值，然后打印出来
let genObj = dataConsumer();
genObj.next(); // Started
genObj.next('a') // 1. a
genObj.next('b') // 2. b
```

​        如果想要第一次调用next方法时就能够输入值，可以在Generator函数外面再包一层，否则是无法做到的。因为Generator函数在被创建时默认会立即执行，并且没有参数。如果想在第一次调用next方法时输入参数，需要使用一个外部函数来创建并返回这个Generator函数，并在外部函数中处理参数。

```javascript
function* myGeneratorFunction() {  
  let value = yield 'hello';  
  console.log(value);  
}    
function createGenerator(input) {  
  return myGeneratorFunction().next(input).value;  
} //createGenerator函数接收一个参数input，并返回myGeneratorFunction的第一次迭代的value属性 
const result = createGenerator('world'); //可以通过调用createGenerator函数并传入参数来影响myGeneratorFunction的执行
console.log(result); // 输出：'world'
```

## 5、for...of 循环

​         可以自动遍历Generator函数运行时生成的Iterator对象，且此时不再需要调用next方法。

​        可以写出遍历任意对象的方法。原生的JavaScript对象没有遍历接口，无法使用for...of循环，通过Generator函数为它加上这个接口，就可以用了。

```javascript
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
} //通过Generator函数objectEntries为它加上遍历器接口
let jane = { first: 'Jane', last: 'Doe' }; //对象jane原生不具备Iterator接口，无法用for...of遍历
for (let [key, value] of objectEntries(jane)) { //就可以用for...of遍历了
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
//加上遍历器接口的另一种写法是将Generator函数加到对象的Symbol.iterator属性上面
jane[Symbol.iterator] = objectEntries;
for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
```

​        除了for...of循环外，扩展运算符(...)、解构赋值和Array.from方法内部调用的都是遍历器接口。这意味着，它们都可以将Generator函数返回的Iterator对象作为参数。

## 6、Generator.prototype.throw()

​        可以在函数体外抛出错误，然后在Generator函数体内捕获。throw方法可以接受一个参数，该参数会被catch语句接收，建议抛出Error对象的实例。

```javascript
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};
var i = g();
i.next();
i.throw(new Error('出错了！'));
// Error: 出错了！(…)
```

​        注意，不要混淆遍历器对象的throw方法和全局的throw命令。上面代码的错误是用遍历器对象的throw方法抛出的，不是用throw命令抛出的。后者只能被函数体外的catch语句捕获。

​        如果Generator函数内部没有部署try...catch代码块，那么throw方法抛出的错误将被外部try...catch代码块捕获。

​        如果Generator函数内部和外部都没有部署try...catch代码块，那么程序将报错，直接中断执行。

​        throw方法抛出的错误要被内部捕获，前提是必须至少执行过一次next方法。因为第一次执行next方法等同于启动执行Generator函数的内部代码，否则Generator函数还没有开始执行，这时throw方法抛错只可能抛出在函数外部。

​        throw方法被捕获以后会附带执行下一条yield表达式。也就是说，会附带执行一次next方法。只要Generator函数内部部署了try...catch代码块，那么遍历器的throw方法抛出的错误不会影响到遍历器的状态，不影响下一次遍历。

​       Generator函数体外抛出的错误可以在函数体内捕获；反过来，Generator函数体内抛出的错误也可以被函数体外的catch捕获。一旦执行过程中抛出错误且没有被内部捕获，就不会再执行下去了。如果此后还调用next方法，将返回一个value属性等于undefined、done属性等于true的对象，即 JS引擎认为这个Generator已经运行结束了。

## 7、Generator.prototype.return()

​        可以返回给定的值并且终结遍历Generator函数。如果return方法调用时不提供参数，则返回值的value属性为undefined。调用return()方法后，就开始执行finally代码块，不执行try里面剩下的代码了，然后等到finally代码块执行完，再返回return()方法指定的返回值。

## 8、next()、throw()、return() 的共同点

​        它们的作用都是让Generator函数恢复执行，并且使用不同的语句替换yield表达式。

- next()是将yield表达式替换成一个值。

```javascript
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};
const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}
gen.next(1); // Object {value: 1, done: true}  将yield表达式替换成一个值1，若next没有参数，就相当于替换成undefined
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```

- throw()是将yield表达式替换成一个throw语句。

```javascript
gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```

- return()是将yield表达式替换成一个return语句。

```javascript
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

## 9、yield* 表达式

​         ES6提供了yield*表达式，用来在一个Generator函数里面执行另一个Generator函数。

​        从语法角度看，如果yield表达式后面跟的是一个遍历器对象，需要在yield表达式后面加上星号，表明它返回的是一个遍历器对象，这被称为yield*表达式。

```javascript
function* inner() {
  yield 'hello!';
}
function* outer1() { //outer1没有使用yield*,返回一个遍历器对象
  yield 'open';
  yield inner();
  yield 'close';
}
var gen = outer1() 
gen.next().value // "open"
gen.next().value // 返回一个遍历器对象
gen.next().value // "close"
function* outer2() { //outer2使用了yield*，返回该遍历器对象的内部值
  yield 'open'
  yield* inner()
  yield 'close'
}
var gen = outer2()
gen.next().value // "open"
gen.next().value // "hello!" 返回遍历器对象的内部值
gen.next().value // "close"
```

​        yield*后面的Generator函数(没有return语句时)，等同于在Generator函数内部部署一个for...of循环。它不过是for...of的一种简写形式，完全可以用后者替代前者。反之，在有return语句时，则需要用var value = yield* iterator的形式获取return语句的值。

```javascript
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}
// 等同于
function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

​        如果yield*后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。 实际上，任何数据结构只要有Iterator接口，就可以被yield*遍历。

```javascript
function* gen(){
  yield* ["a", "b", "c"];
} //yield命令后面如果不加星号，返回的是整个数组，加了星号就表示返回的是数组的遍历器对象
gen().next() // { value:"a", done:false }
```

​       如果被代理的Generator函数有return语句，那么就可以向代理它的Generator函数返回数据。

```javascript
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}
function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
}
var it = bar();
it.next() // {value: 1, done: false}
it.next() // {value: 2, done: false}
it.next() // {value: 3, done: false}
it.next();
// "v: foo"  函数foo的return语句向函数bar提供了返回值
// {value: 4, done: false}
it.next() // {value: undefined, done: true}
```

​        yield*命令可以很方便地取出嵌套数组的所有成员。

```javascript
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}
const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];
for(let x of iterTree(tree)) {
  console.log(x);
}
// a
// b
// c
// d
// e
//由于扩展运算符...默认调用Iterator接口，所以上面这个函数也可以用于嵌套数组的平铺
[...iterTree(tree)] // ["a", "b", "c", "d", "e"]
```

## 10、作为对象属性的 Generator 函数

​        如果一个对象的属性是Generator函数，可以简写成下面的形式。

```javascript
let obj = {
  * myGeneratorMethod() { //前面有一个星号，表示这个属性是一个Generator函数
    ···
  }
};
//它的完整形式如下，与上面的写法是等价的
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```

## 11、Generator 函数的this

​        Generator函数*\*总是返回一个遍历器\*\**\***，ES6规定这个遍历器是Generator函数的实例，也继承了Generator函数的prototype对象上的方法。

```javascript
function* g() {}
g.prototype.hello = function () {
  return 'hi!';
};
let obj = g(); //g返回的遍历器obj是g的实例，而且继承了g.prototype
obj instanceof g // true
obj.hello() // 'hi!'
```

   但是，如果把g当作普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是this对象。

```javascript
function* g() {
  this.a = 11; //Generator函数g在this对象上面添加了一个属性a
}
let obj = g();
obj.next();
obj.a // undefined 但是obj对象拿不到这个属性
```

​        Generator函数也不能跟new命令一起用，会报错。

```javascript
function* F() {
  yield this.x = 2;
  yield this.y = 3;
}
new F() // TypeError: F is not a constructor
//new命令跟构造函数F一起使用，结果报错，因为F不是构造函数
```

​      有个方法可让Generator函数返回一个正常的对象实例，既可以用next方法又可以获得正常的this：首先，生成一个空对象，使用call方法绑定Generator函数内部的this。这样，构造函数调用以后，这个空对象就是Generator函数的实例对象了。

```javascript
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
function F() {
  return gen.call(gen.prototype);
}
var f = new F();
f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}
f.a // 1
f.b // 2
f.c // 3
```

# Generator 函数的异步应用

## 1、传统方法

​         ES6诞生以前，异步编程的方法大概有下面四种。

- 回调函数
- 事件监听
- 发布/订阅
- Promise对象

​        Generator函数将JavaScript异步编程带入了一个全新的阶段。

## 2、基本概念

- 异步：简单说就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。这种不连续的执行就叫做异步。
- 回调函数：就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。回调函数的英语名字callback，直译过来就是"重新调用"。
- 回调地狱：多个异步操作形成了强耦合，只要有一个操作需要修改，它的上层回调函数和下层回调函数可能都要跟着修改。这种情况就称为回调函数地狱。
- Promise：可以解决回调地狱的问题，是一种新的写法，允许将回调函数的嵌套改成链式调用。提供then方法加载回调函数，catch方法捕捉执行过程中抛出的错误。最大问题是代码冗余，原来的任务被Promise包装了一下，不管什么操作，一眼看去都是一堆then，原来的语义变得很不清楚。

## 3、Generator 函数

### 协程的 Generator 函数实现

​        Generator函数是协程在ES6的实现，最大特点就是可以交出函数的执行权(即暂停执行)。整个Generator函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用yield语句注明。

```javascript
function* gen(x) {
  var y = yield x + 2;
  return y;
}
var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```

### Generator 函数的数据交换和错误处理

​        Generator函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。它还有两个特性使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。next返回值的value属性是Generator函数向外输出数据；next方法还可以接受参数，向Generator函数体内输入数据。

```javascript
function* gen(x){
  var y = yield x + 2;
  return y;
}
var g = gen(1);
g.next() // { value: 3, done: false }
g.next(2) // { value: 2, done: true } 带有参数2，可传入Generator函数，被函数体内的变量y接收，这一步的value属性返回的就是2(变量y的值)
```

​        Generator函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。出错的代码与处理错误的代码实现了时间和空间上的分离。

```javascript
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){
    console.log(e);
  }
  return y;
}
var g = gen(1);
g.next();
g.throw('出错了'); //函数体外用指针对象的throw方法抛出的错误，可被函数体内的try...catch代码块捕获
// 出错了
```

### 异步任务的封装

​        虽然Generator函数将异步操作表示得很简洁，但是流程管理却不方便(即何时执行第一阶段、何时执行第二阶段)。举个例子看看如何使用Generator函数执行一个真实的异步任务。

```javascript
var fetch = require('node-fetch');
function* gen(){
  var url = 'https://api.github.com/users/github';  //先读取一个远程接口
  var result = yield fetch(url);  //然后从JSON格式的数据解析信息
  console.log(result.bio);
} //这段代码非常像同步操作，除了加上了yield命令
//执行这段代码的方法如下
var g = gen(); //首先执行Generator函数，获取遍历器对象
var result = g.next(); //然后使用next方法执行异步任务的第一阶段
result.value.then(function(data){ //由于Fetch模块返回的是一个Promise对象，因此要用then方法调用下一个next方法
  return data.json();
}).then(function(data){
  g.next(data);
});
```

## 4、Thunk 函数

​        Thunk函数是自动执行Generator函数的一种方法。

参数的求值策略

- 传值调用(call by value)：即在进入函数体之前，就计算x+5的值(等于6)，再将这个值传入函数f。
- 传名调用(call by name)：即直接将表达式x+5传入函数体，只在用到它的时候求值。

Thunk 函数的含义

​        编译器的传名调用实现，往往是将参数放到一个临时函数中，再将这个临时函数传入函数体。这个临时函数就叫做Thunk函数。它是传名调用的一种实现策略，用来替换某个表达式。

```javascript
function f(m) {
  return m * 2;
}
f(x + 5);
// 等同于
var thunk = function () {
  return x + 5;
}; //函数f的参数x+5被一个函数替换了，凡是用到原参数的地方，对Thunk函数求值即可
function f(thunk) {
  return thunk() * 2;
}
```

JavaScript 语言的 Thunk 函数

​        JavaScript语言是传值调用，它的Thunk函数替换的不是表达式，而是将多参数函数替换成一个只接受回调函数作为参数的单参数函数。任何函数，只要参数有回调函数，就能写成Thunk函数的形式。

```javascript
function f(a, cb) {
  cb(a);
}
const ft = Thunk(f);
ft(1)(console.log) // 1
```

Thunkify 模块

​        生产环境的转换器建议使用Thunkify模块。它的源码主要多了一个检查机制，变量called确保回调函数只运行一次。只允许回调函数执行一次。

```javascript
// $ npm install thunkify
var thunkify = require('thunkify');
var fs = require('fs');
var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});
```

Generator 函数的流程管理

​        Generator函数可以自动执行。Thunk函数可以用于Generator函数的自动流程管理，它可以在回调函数里将执行权交还给Generator函数。

```javascript
var g = gen();
var r1 = g.next();
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
}); //Generator函数的执行过程，其实是将同一个回调函数反复传入next方法的value属性
```

Thunk 函数的自动流程管理

​        Thunk函数可以自动执行Generator函数，但它并不是Generator函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制自动控制Generator函数的流程，接收和交还程序的执行权。回调函数可以做到这一点，Promise 对象也可以做到这一点。

```javascript
function run(fn) {
  var gen = fn();
  function next(err, data) { //内部的next函数就是Thunk的回调函数
    var result = gen.next(data); //next函数先将指针移到Generator函数的下一步(gen.next方法)
    if (result.done) return; //然后判断Generator函数是否结束(result.done属性)，是就直接退出
    result.value(next); //如果没结束，就将next函数再传入Thunk函数(result.value属性)
  }
  next();
}
function* g() {
  // ...
}
run(g);  //这是一个基于Thunk函数的Generator执行器
//有了这个执行器，执行Generator函数方便多了。不管内部有多少个异步操作，直接把Generator函数传入run函数即可。当然，前提是每一个异步操作都要是Thunk函数，也就是说，跟在yield命令后面的必须是Thunk函数
var g = function* (){
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};
run(g);//函数g封装了n个异步的读取文件操作，只要执行run函数，这些操作就会自动完成
```

## 5、co 模块

​        是一个小工具，用于Generator函数的自动执行。co函数返回一个Promise对象，因此可以用then方法添加回调函数。

```javascript
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
var co = require('co');
co(gen).then(function (){
  console.log('Generator 函数执行完成'); //等到Generator函数执行结束，就会输出一行提示
});
```

co 模块的原理

​        Generator就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。两种方法可以做到这一点。

（1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。

（2）Promise对象。将异步操作包装成Promise对象，用then方法交回执行权。

​         co模块其实就是将两种自动执行器(Thunk函数和Promise对象)包装成一个模块。使用co的前提条件是，Generator函数的yield命令后面只能是Thunk函数或Promise对象。如果数组或对象的成员全部都是Promise对象，也可以使用co。

​        co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成才进行下一步。这时，要把并发的操作都放在数组或对象里面，跟在yield语句后面。

```javascript
co(function* () {
  var values = [n1, n2, n3];
  yield values.map(somethingAsync);
});
function* somethingAsync(x) {
  // do something async
  return y
} //上面的代码允许并发三个somethingAsync异步操作，等到它们全部完成才会进行下一步
```