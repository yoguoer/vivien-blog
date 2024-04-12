---
title: Iterator和for...of循环
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Note
tags:       # 标签
 - JavaScript
---

## 1、Iterator（遍历器）的概念

​        遍历器(Iterator)是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署Iterator接口，就可以完成遍历操作(即依次处理该数据结构的所有成员)。

​        Iterator的作用有三个：

- (1) 为各种数据结构提供一个统一的、简便的访问接口；
- (2) 使得数据结构的成员能够按某种次序排列； 
- (3) ES6创造了一种新的遍历命令for...of循环，Iterator接口主要供for...of消费。

​       Iterator 的遍历过程是这样的：

- (1) 创建一个指针对象，指向当前数据结构的起始位置。遍历器对象本质上就是一个指针对象。
- (2) 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
- (3) 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
- (4) 不断调用指针对象的next方法，直到它指向数据结构的结束位置。

​         每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象，value是当前位置的成员的值，done是一个布尔值，表示遍历是否结束，即是否还有必要再一次调用next。总之，调用指针对象的next方法就可以遍历事先给定的数据结构。

```javascript
var it = makeIterator(['a', 'b']);
it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true}; //done:false和value:undefined属性都是可以省略
    }
  };
}
```

​       由于Iterator只是把接口规格加到数据结构之上，所以，遍历器与它所遍历的那个数据结构实际上是分开的，完全可以写出没有对应数据结构的遍历器对象，或者说用遍历器对象模拟出数据结构。下面是一个无限运行的遍历器对象的例子。

```javascript
var it = idMaker();
it.next().value // 0
it.next().value // 1
it.next().value // 2
// ...
function idMaker() {
  var index = 0;
  return {
    next: function() {
      return {value: index++, done: false};
    }
  };
}//遍历器生成函数idMaker，返回一个遍历器对象(即指针对象)。但是并没有对应的数据结构，或者说，遍历器对象自己描述了一个数据结构出来。
```

​        如果使用 TypeScript 的写法，遍历器接口、指针对象和next方法返回值的规格可以描述如下：

```javascript
interface Iterable { //遍历器接口(Iterable)
  [Symbol.iterator]() : Iterator,
}
interface Iterator { //指针对象(Iterator)
  next(value?: any) : IterationResult,
}
interface IterationResult { //next方法返回值
  value: any,
  done: boolean,
}
```

## 2、默认 Iterator 接口

​        Iterator接口的目的，就是为所有数据结构提供了一种统一的访问机制，即for...of循环。当使用for...of循环遍历某种数据结构时，该循环会自动去寻找Iterator接口。一种数据结构只要部署了Iterator接口(具有Symbol.iterator属性)，我们就称这种数据结构是可遍历的(iterable)，部署了遍历器接口，调用这个接口，就会返回一个遍历器对象。

​        Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数，执行后返回当前对象的遍历器对象。至于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性，这是一个预定义好的、类型为Symbol的特殊值，所以要放在方括号内。

```javascript
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};//obj是可遍历的，因为具有Symbol.iterator属性。执行这个属性，会返回一个遍历器对象。该对象的根本特征就是具有next方法。每次调用next方法，都会返回一个代表当前成员的信息对象，具有value和done两个属性。
```

***\*原生具备Iterator接口的数据结构如下：

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

​       对于原生部署Iterator接口的数据结构，不用自己写遍历器生成函数，for...of循环会自动遍历它们。除此之外，其他数据结构(主要是对象)的Iterator接口，都需要自己在Symbol.iterator属性上面部署遍历器生成方法(原型链上的对象具有该方法也可)，这样才会被for...of循环遍历。也可用while循环遍历。

​        对象(Object)之所以没有默认部署Iterator接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口就等于部署一种线性转换。不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作Map结构使用，ES5没有Map结构，而ES6原生提供了。

​        对于类似数组的对象(存在数值键名和length属性)，部署Iterator接口，有一个简便方法，就是Symbol.iterator方法直接引用数组的Iterator接口。

```javascript
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];
[...document.querySelectorAll('div')] // 可以执行了
```

​        注意，普通对象部署数组的Symbol.iterator方法并无效果。如果Symbol.iterator方法对应的不是遍历器生成函数(即会返回一个遍历器对象)，解释引擎将会报错。

## 3、调用 Iterator 接口的场合

​        有一些场合会默认调用Iterator接口(即Symbol.iterator方法)。

- (1)解构赋值：对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。
- (2)扩展运算符：扩展运算符(…)也会调用默认的Iterator接口。实际上，这提供了一种简便机制，可以将任何部署了Iterator接口的数据结构转为数组。也就是说，只要某个数据结构部署了Iterator接口，就可以对它使用扩展运算符，将其转为数组。
- (3)yield\*：yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。
- (4)其他场合：由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。
  - for…of
  - Array.from()
  - Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
  - Promise.all()
  - Promise.race()

## 4、字符串的 Iterator 接口

​        字符串是一个类似数组的对象，也原生具有Iterator接口。调用Symbol.iterator方法返回一个遍历器对象，在这个遍历器上可以调用next方法实现对于字符串的遍历。

```javascript
var someString = "hi";
typeof someString[Symbol.iterator]
// "function"
var iterator = someString[Symbol.iterator]();
iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }
```

  可以覆盖原生的Symbol.iterator方法，达到修改遍历器行为的目的。

## 5、Iterator 接口与 Generator 函数

Symbol.iterator方法的最简单实现几乎不用部署任何代码，只要用yield命令给出每一步的返回值即可。

```javascript
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
}
[...myIterable] // [1, 2, 3]
// 或者采用下面的简洁写法
let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};
for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"
```

## 6、遍历器对象的 return()，throw()

​        遍历器对象除了具有next方法，还可以具有return方法和throw方法。如果自己写遍历器对象生成函数，那么next方法是必须部署的，return方法和throw方法是否部署是可选的。

- return方法的使用场合是：如果for...of循环提前退出(通常是因为出错，或者有break语句)，就会调用return方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法。
  - 注意，return方法必须返回一个对象，这是Generator规格决定的。
  - throw方法主要是配合Generator函数使用，一般的遍历器对象用不到这个方法。

```javascript
// 触发执行return方法的情况一
for (let line of readLinesSync(fileName)) {
  console.log(line); //关闭这个文件
  break;
}
// 触发执行return方法的情况二
for (let line of readLinesSync(fileName)) {
  console.log(line); //关闭这个文件
  throw new Error(); //抛出错误
}
```

## 7、for...of 循环

​     一个数据结构只要部署了Symbol.iterator属性，就被视为具有iterator接口，就可以用for...of循环遍历它的成员。就是说，for...of循环内部调用的是数据结构的Symbol.iterator方法。for...of循环可以使用的范围包括数组、Set和Map结构、某些类似数组的对象(比如arguments对象、DOM NodeList对象)、Generator对象以及字符串。

### 数组

​        数组原生具备iterator接口(即默认部署了Symbol.iterator属性)，for...of循环本质上就是调用这个接口产生的遍历器。for...of循环可以代替数组实例的forEach方法。

- JavaScript原有的for...in循环只能获得对象的键名，不能直接获取键值。ES6提供for...of循环允许遍历获得键值。for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性，for...in循环则数字索引和字符串索引都能返回。

```javascript
var arr = ['a', 'b', 'c', 'd'];
for (let a in arr) {
  console.log(a); // 0 1 2 3
}
for (let a of arr) {
  console.log(a); // a b c d （允许遍历获得键值）
}
let arr = [3, 5, 7];
arr.foo = 'hello';
for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}
for (let i of arr) {
  console.log(i); //  "3", "5", "7"  （只返回具有数字索引的属性）
}
```

- 如果要通过for...of循环获取数组的索引，可以借助数组实例的entries方法和keys方法。

### Set 和 Map 结构

​        Set和Map结构也原生具有Iterator接口，可以直接使用for...of循环。①遍历的顺序是按照各个成员被添加进数据结构的顺序。②Set结构遍历时，返回的是一个值，而Map结构遍历时，返回的是一个数组，该数组的两个成员分别为当前Map成员的键名和键值。

```javascript
let map = new Map().set('a', 1).set('b', 2);
for (let pair of map) {
  console.log(pair);
}
// ['a', 1]
// ['b', 2]
for (let [key, value] of map) {
  console.log(key + ' : ' + value);
}
// a : 1
// b : 2
```

### 计算生成的数据结构

​        有些数据结构是在现有数据结构的基础上计算生成的。比如，ES6的数组、Set、Map都部署了以下三个方法，调用后都返回遍历器对象。

- entries()：返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值；对于Set，键名与键值相同。Map结构的Iterator接口，默认就是调用entries方法。
- keys()：返回一个遍历器对象，用来遍历所有的键名。
- values()：返回一个遍历器对象，用来遍历所有的键值。

```javascript
let arr = ['a', 'b', 'c'];
for (let pair of arr.entries()) {
  console.log(pair);
} //这三个方法调用后生成的遍历器对象所遍历的都是计算生成的数据结构
// [0, 'a']
// [1, 'b']
// [2, 'c']
```

### 类似数组的对象

​         类似数组的对象是指那些拥有与数组类似的结构，但并非严格意义上的数组对象。比如字符串、DOM NodeList 对象、arguments对象。

​        对于字符串来说，for...of循环还会正确识别32位UTF-16字符。并不是所有类似数组的对象都具有Iterator接口，可用Array.from方法将其转为数组。

```javascript
let arrayLike = { length: 2, 0: 'a', 1: 'b' };
// 报错
for (let x of arrayLike) {
  console.log(x);
}
// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```

### 对象

​        对于普通的对象，for...of结构不能直接使用，会报错，必须部署了Iterator接口后才能使用。但是这样情况下，for...in循环依然可以用来遍历键名。

​      对于普通的对象，for...in循环可遍历键名，for...of循环会报错。一种方法是使用Object.keys方法将对象的键名生成一个数组，然后遍历这个数组。另一个方法是使用Generator函数将对象重新包装一下。

```javascript
for (var key of Object.keys(someObject)) { //使用Object.keys方法将对象的键名生成一个数组
  console.log(key + ': ' + someObject[key]);
}
function* entries(obj) {//使用Generator函数将对象重新包装一下
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}
for (let [key, value] of entries(obj)) {
  console.log(key, '->', value);
}
// a -> 1
// b -> 2
// c -> 3
```

### 与其他遍历语法的比较

​        ①以数组为例，JavaScript 提供多种遍历语法。最原始的写法就是for循环。这种写法比较麻烦。

​        ②后来数组提供内置的forEach方法，但这种写法无法中途跳出forEach循环，break命令或return命令都不能奏效。

​       ③ for...in循环可以遍历数组的键名。for...in循环主要是为遍历对象而设计的，不适用于遍历数组。

- ***\*for...in有几个缺点：
  - 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
  - for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
  - 某些情况下，for...in循环会以任意顺序遍历键名。
- 相比上面几种做法，***\*for...of有一些显著的优点：
  - 有着同for...in一样的简洁语法，但是没有for...in那些缺点。
  - 不同于forEach方法，它可以与break、continue和return配合使用。
  - 提供了遍历所有数据结构的统一操作接口。