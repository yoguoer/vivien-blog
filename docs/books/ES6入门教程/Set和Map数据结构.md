---
title: Set和Map数据结构
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Note
tags:       # 标签
 - JavaScript
---

## 1、Set

​        ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。Set本身是一个构造函数，用来生成Set数据结构。

​        Set函数可以接受一个数组(或者具有iterable接口的其他数据结构)作为参数，用来初始化。

```javascript
// 例一 接受数组作为参数
const set = new Set([1, 2, 3, 4, 4]);
[...set] // [1, 2, 3, 4]
// 例二 接受数组作为参数
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5
// 例三 接受类似数组的对象作为参数
const set = new Set(document.querySelectorAll('div'));
set.size // 56
// 类似于
const set = new Set();
document
 .querySelectorAll('div')
 .forEach(div => set.add(div));
set.size // 56
```

​        可以用于去除数组重复成员，也可以用于去除字符串里面的重复字符。

```javascript
[...new Set(array)] // 去除数组的重复成员
[...new Set('ababbc')].join('') // "abc" 去除字符串里面的重复字符
```

​        向Set加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符(===)，主要的区别是向Set加入值时认为NaN等于自身，而精确相等运算符认为NaN不等于自身。在Set内部，两个NaN是相等的，比如向Set实例添加两次NaN，但是只会加入一个。

​         两个对象总是不相等的。

```javascript
let set = new Set();
set.add({});
set.size // 1
set.add({});
set.size // 2 由于两个空对象不相等，所以它们被视为两个值
```

### Set 实例的属性和方法

- Set结构的实例有以下属性。
  - Set.prototype.constructor：构造函数，默认就是Set函数。
  - Set.prototype.size：返回Set实例的成员总数。
- Set实例的方法分为两大类：操作方法(用于操作数据)和遍历方法(用于遍历成员)。
  - Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
  - Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
  - Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
  - Set.prototype.clear()：清除所有成员，没有返回值。

​        Array.from方法可以将Set结构转为数组。这就提供了去除数组重复成员的另一种方法。

```javascript
function dedupe(array) {
  return Array.from(new Set(array));
}
dedupe([1, 1, 2, 3]) // [1, 2, 3]
```

### 遍历操作

- Set 结构的实例有四个遍历方法，可以用于遍历成员。
  - Set.prototype.keys()：返回键名的遍历器
  - Set.prototype.values()：返回键值的遍历器
  - Set.prototype.entries()：返回键值对的遍历器
  - Set.prototype.forEach()：使用回调函数遍历每个成员

​        需要特别指出的是，Set的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用Set保存一个回调函数列表，调用时就能保证按照添加顺序调用。

（1）keys()，values()，entries()

​         keys方法、values方法、entries方法返回的都是遍历器对象。由于Set结构没有键名，只有键值(或者说键名和键值是同一个值)，所以keys方法和values方法的行为完全一致。

```javascript
let set = new Set(['red', 'green', 'blue']);
for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue
for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue
for (let item of set.entries()) {
  console.log(item);
}//entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

​        Set结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。这意味着，可以省略values方法，直接用for...of循环遍历Set。

```javascript
Set.prototype[Symbol.iterator] === Set.prototype.values // true
let set = new Set(['red', 'green', 'blue']);
for (let x of set) {
  console.log(x);
}
// red
// green
// blue
```

（2）forEach()

​        Set结构的实例与数组一样，也拥有forEach方法，用于对每个成员执行某种操作，没有返回值。

```javascript
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
```

​        forEach方法的参数就是一个处理函数。该函数的参数与数组的forEach一致，依次为键值、键名、集合本身(上例省略了该参数)。注意，Set结构的键名就是键值(两者是同一个值)，因此第一个参数与第二个参数的值永远都是一样的。forEach方法还可以有第二个参数，表示绑定处理函数内部的this对象。

（3）遍历的应用

​        扩展运算符(...)内部使用for...of循环，所以也可以用于Set结构。扩展运算符和Set结构相结合，就可以去除数组的重复成员。

```javascript
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];// ['red', 'green', 'blue']
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)]; // [3, 5, 2]
```

​        数组的map和filter方法也可以间接用于Set，因此使用Set可以很容易地实现并集(Union)、交集(Intersect)和差集(Difference)。

```javascript
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
// 并集
let union = new Set([...a, ...b]); // Set {1, 2, 3, 4}
// 交集
let intersect = new Set([...a].filter(x => b.has(x))); // set {2, 3}
// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x))); // Set {1}
```

​        如果想在遍历操作中同步改变原来的Set结构，目前没有直接的方法，但有两种变通方法。

- 一种是利用原Set结构映射出一个新的结构，然后赋值给原来的Set结构；
- 另一种是利用Array.from方法。

```javascript
// 直接在遍历操作中改变原来的Set结构的两种方法
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2)); // set的值是2, 4, 6
// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2)); // set的值是2, 4, 6
```

## 2、WeakSet

​        WeakSet结构与Set类似，也是不重复的值的集合。但是，它与Set有两个区别。

- 首先，WeakSet的成员*\*只能是对象\*\**\***，而不能是其他类型的值。WeakSet只能放置对象。
- 其次，WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于WeakSet之中。WeakSet里面的引用都不计入垃圾回收机制。
  - WeakSet没有size属性，没有办法遍历它的成员。
  - WeakSet不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。
  - WeakSet的一个用处是储存DOM节点，而不用担心这些节点从文档移除时会引发内存泄漏。

​        WeakSet是一个构造函数，可以使用new命令创建WeakSet数据结构。作为构造函数，WeakSet可以接受一个数组或类似数组的对象作为参数。(实际上，任何具有Iterable接口的对象都可以作为WeakSet的参数。)该数组的所有成员，都会自动成为WeakSet实例对象的成员。

```javascript
const a = [[1, 2], [3, 4]]; //a有两个成员，也都是数组，将a作为WeakSet构造函数的参数
const ws = new WeakSet(a); //WeakSet {[1, 2], [3, 4]}。a的成员会自动成为WeakSet的成员
//注意，是a数组的成员成为WeakSet的成员，而不是a数组本身。这意味着，数组的成员只能是对象。
```

- WeakSet 结构有以下三个方法。
  - WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
  - WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
  - WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

## 3、Map

​          ES6提供了Map数据结构。它类似于对象，也是键值对的集合，但键的范围不限于字符串，各种类型的值(包括对象)都可以当作键。也就是说，Object结构提供了字符串—值的对应，Map结构提供了值—值的对应，是一种更完善的Hash结构实现。如果需要键值对的数据结构，Map比Object更合适。

```javascript
const m = new Map();
const o = {p: 'Hello World'};
m.set(o, 'content') //使用Map结构的set方法，将对象o当作m的一个键
m.get(o) // "content" 使用get方法读取这个键
m.has(o) // true
m.delete(o) // true 使用delete方法删除这个键
m.has(o) // false
```

​        作为构造函数，Map也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。

```javascript
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]); //在新建Map实例时，就指定了两个键name和title
map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

​        事实上，不仅仅是数组，任何具有Iterator接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数。这就是说，Set和Map都可以用来生成新的Map。如果对同一个键多次赋值，后面的值将覆盖前面的值。

```javascript
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1
const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3 
//分别使用Set对象和Map对象当作Map构造函数的参数，结果都生成了新的Map对象
```

​        注意，只有对同一个对象的引用，Map结构才将其视为同一个键。这一点要非常小心。同理，同样的值的两个实例，在Map结构中被视为两个键

```javascript
const map = new Map();
map.set(['a'], 555);
map.get(['a']) // undefined。如果读取一个未知的键，则返回undefined
//表面是针对同一个键，但实际上是两个不同的数组实例，内存地址不一样，因此get方法无法读取该键，返回undefined。
//变量k1和k2的值是一样的，但是它们在Map结构中被视为两个键
const map = new Map();
const k1 = ['a'];
const k2 = ['a'];
map
.set(k1, 111)
.set(k2, 222);
map.get(k1) // 111
map.get(k2) // 222
```

​        Map的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。解决了同名属性碰撞的问题，我们扩展别人的库时，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

​        如果Map的键是一个简单类型的值(数字、字符串、布尔值)，则只要两个值严格相等，Map将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，undefined和null也是两个不同的键。虽然NaN不严格相等于自身，但Map将其视为同一个键。

### Map实例的属性和操作方法

- Map 结构的实例有以下属性和操作方法。
  - size 属性：size属性返回Map结构的成员总数。
  - Map.prototype.set(key, value)：set方法设置键名key对应的键值为value，然后返回整个Map结构。如果key已经有值，则键值会被更新，否则就新生成该键。set方法返回的是当前的Map对象，因此可以采用链式写法。
  - Map.prototype.get(key)：get方法读取key对应的键值，如果找不到key，返回undefined。
  - Map.prototype.has(key)：has方法返回一个布尔值，表示某个键是否在当前Map对象之中。
  - Map.prototype.delete(key)：delete方法删除某个键，返回true。如果删除失败，返回false。
  - Map.prototype.clear()：clear方法清除所有成员，没有返回值。

### 遍历操作

- Map 结构原生提供三个遍历器生成函数和一个遍历方法。
  - Map.prototype.keys()：返回键名的遍历器。
  - Map.prototype.values()：返回键值的遍历器。
  - Map.prototype.entries()：返回所有成员的遍历器。
  - Map.prototype.forEach()：遍历Map的所有成员。

​        注意，Map的遍历顺序就是插入顺序。Map结构的默认遍历器接口就是entries方法。

```javascript
map[Symbol.iterator] === map.entries // true
```

​        Map结构转为数组结构，比较快速的方法是使用扩展运算符（...）。

```javascript
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);
[...map.keys()] // [1, 2, 3]
[...map.values()] // ['one', 'two', 'three']
[...map.entries()] // [[1,'one'], [2, 'two'], [3, 'three']]
[...map] // [[1,'one'], [2, 'two'], [3, 'three']]
```

​      结合数组的map方法、filter方法，可以实现Map的遍历和过滤(Map本身没有map和filter方法)。

```javascript
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
); // 产生 Map 结构 {1 => 'a', 2 => 'b'}
const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    ); // 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```

​        Map 还有一个forEach方法，与数组的forEach方法类似，也可以实现遍历。forEach方法还可以接受第二个参数，用来绑定this。

```javascript
const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};
map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter); //forEach方法的回调函数的this，就指向reporter
```

### 与其他数据结构的互相转换

（1）Map转为数组：Map转为数组最方便的方法，就是使用扩展运算符（...）。

```javascript
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap] // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

（2）*\*数组转为 Map\*\**\***：将数组传入Map构造函数，就可以转为Map。

```javascript
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
```

（3）Map 转为对象：如果所有Map的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。

（4）对象转为 Map：对象转为Map可以通过Object.entries()。

```javascript
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));
```

（5）Map 转为JSON：Map转为JSON要区分两种情况。一种情况是，Map的键名都是字符串，这时可以选择转为对象JSON。另一种情况是，Map的键名有非字符串，这时可以选择转为数组JSON。

```javascript
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}
let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap) // '{"yes":true,"no":false}' Map的键名都是字符串
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}
let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap) // '[[true,7],[{"foo":3},["abc"]]]' Map的键名有非字符串
```

（6）JSON 转为 Map：正常情况下，所有键名都是字符串。但是，有一种特殊情况，整个JSON就是一个数组，且每个数组成员本身又是一个有两个成员的数组。这时，它可以一一对应地转为Map。这往往是Map转为数组JSON的逆操作。

```javascript
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}
jsonToStrMap('{"yes": true, "no": false}') // Map {'yes' => true, 'no' => false}
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}
jsonToMap('[[true,7],[{"foo":3},["abc"]]]') // Map {true => 7, Object {foo: 3} => ['abc']}
```

## 4、WeakMap

​       WeakMap结构与Map结构类似，也是用于生成键值对的集合。WeakMap与Map的区别有两点。

- 首先，WeakMap只接受对象作为键名(null除外)，不接受其他类型的值作为键名。
- 其次，WeakMap的键名所指向的对象都是弱引用，不计入垃圾回收机制，没有遍历操作。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。一旦不再需要，WeakMap里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。
  - 如果要往对象上添加数据又不想干扰垃圾回收机制，就可以使用WeakMap。一个典型应用场景是，在网页的DOM元素上添加数据，就可以使用WeakMap结构。当该DOM元素被清除，其所对应的WeakMap记录就会自动被移除。
  - ①没有size属性，没有遍历操作(即没有keys()、values()和entries()方法)，②无法清空(即不支持clear方法)。因此，WeakMap只有四个方法可用：get()、set()、has()、delete()。
  - WeakMap的专用场合就是，它的键所对应的对象可能会在将来消失。WeakMap结构有助于防止内存泄漏。注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。

```javascript
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};
wm.set(key, obj);
obj = null;
wm.get(key) // Object {foo: 1}
//键值obj是正常引用，所以即使在WeakMap外部消除了obj的引用，WeakMap内部的引用依然存在。
```

- 另一个用处是部署私有属性。