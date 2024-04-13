---
title: Proxy
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - JavaScript
---

> ​        Proxy可以理解为一个代理器，用于在目标对象之前架设一层“拦截”，外界对该对象的访问都必须先通过这层拦截。因此，提供了一种机制，可以对外界的访问进行过滤和改写。Proxy对象主要由两个参数构成：目标对象(target)和代理器对象(handler)，当对Proxy实例进行操作时，会自动调用handler对象的对应属性，对目标对象的操作进行拦截并改写。它还有一个可选的第三个参数，名为receiver，代表的是实际调用者，也就是最初调用该方法的对象。

​    Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种元编程，即对编程语言进行编程。可以理解成，在目标对象之前架设一层拦截，外界对该对象的访问都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy这个词的原意是代理，用在这里表示由它来代理某些操作，可以译为代理器。

​        ES6原生提供Proxy构造函数，用来生成Proxy实例。

```javascript
var proxy = new Proxy(target, handler);
```

​         Proxy的所有用法都是上面这种形式，不同的只是handler参数的写法。new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。同一个拦截器函数可以设置拦截多个操作。

​        注意，要使得Proxy起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作。

```javascript
const initData = { value: 1, };
const proxy = new Proxy(initData, {
    get: function (target, key) { 
        //数据依赖收集
        console.1og('访问:' , key);
        return Reflect.get(target, key); 
    },
    set: function (target, key, value) {
        //数据更新
        console.log('修改',key);
        return Reflect.set(target, key, value); 
    },
});
//Proxy接受两个参数。
//第一个参数是所要代理的目标对象，即如果没有Proxy的介入，操作原来要访问的就是这个对象；
//第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。
```

​        如果handler没有设置任何拦截，那就等同于直接通向原对象。

```javascript
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a // "b" handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问target
//一个技巧是将Proxy对象，设置到object.proxy属性，从而可以在object对象上调用
var object = { proxy: new Proxy(target, handler) };
```

​        Proxy 实例也可以作为其他对象的原型对象。

```javascript
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});
let obj = Object.create(proxy);
obj.time // 35。proxy对象是obj对象的原型,obj本身并没有time属性，根据原型链，会在proxy对象上读取该属性，导致被拦截
```

​       对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。 Proxy支持的拦截操作一共13种。

## Proxy 实例的方法

- get()

用于拦截某个属性的读取操作。可以接受三个参数，依次为目标对象target、属性名key和proxy实例本身receiver(严格地说，是操作行为所针对的对象)，其中最后一个参数可选，第三个参数总是指向原始的读操作所在的那个对象，一般情况下就是Proxy实例。get方法可以继承。

```javascript
const proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
const d = Object.create(proxy);
d.a === d // true。d本身没有a，所以读取d.a的时候，会去d的原型proxy找。这时receiver就指向d，代表原始的读操作所在的那个对象
```

利用Proxy，可以将读取属性的操作(get)转变为执行某个函数，从而实现属性的链式操作。如果一个属性不可配置且不可写，则Proxy不能修改该属性，否则通过Proxy对象访问该属性会报错。

- set()

用来拦截某个属性的赋值操作。可以接受四个参数，依次为目标对象obj、属性名prop、属性值value和Proxy实例本身receiver，其中最后一个参数可选，第四个参数指的是原始的操作行为所在的那个对象，一般情况下是proxy实例本身。

```javascript
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
const myObj = {};
Object.setPrototypeOf(myObj, proxy);//myObj的原型对象proxy是一个Proxy实例，设置它的foo属性会触发set方法，receiver就指向原始赋值行为所在的对象myObj
myObj.foo = 'bar'; //设置myObj.foo时，myObj没有foo属性，因此引擎会到myObj的原型链去找foo
myObj.foo === myObj // true
```

利用set方法可以数据绑定，即每当对象发生变化时，会自动更新DOM。还可以数据绑定，即每当对象发生变化时，会自动更新DOM。注意，如果目标对象自身的某个属性不可写且不可配置，那么set方法将不起作用。严格模式下，set代理如果没有返回true，就会报错。

> ​        receiver参数代表的是实际调用者，也就是最初调用该方法的对象。在get和set陷阱中，如果目标属性是getter或setter，那么这个getter或setter内部的this会指向这个receiver。

- apply()

用于拦截函数的调用、call和apply操作。可以接受三个参数，分别是目标对象、目标对象的上下文对象(this)和目标对象的参数数组。

```javascript
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6   每当执行proxy函数(直接调用或call和apply调用)，就会被apply方法拦截
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
Reflect.apply(proxy, null, [9, 10]) // 38   直接调用Reflect.apply方法，也会被拦截
```

- has()

​      用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。可以接受两个参数，分别是目标对象target、需查询的属性名key。可以使用has方法隐藏某些属性，不被in运算符发现。如果某个属性不可配置(或者目标对象不可扩展)，则has方法就不得隐藏(即返回false)目标对象的该属性。

```javascript
var obj = { a: 10 };
Object.preventExtensions(obj); //obj对象禁止扩展
var p = new Proxy(obj, {
  has: function(target, prop) {
    return false;
  }
});
'a' in p // TypeError is thrown。obj对象禁止扩展，结果使用has拦截就会报错
```

值得注意的是，has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性。 另外，虽然for...in循环也用到了in运算符，但是has拦截对for...in循环不生效。

- construct()

  用于拦截new命令，可以接受三个参数，分别是目标对象target、构造函数的参数对象args、创造实例对象时new命令作用的构造函数newTarget。construct方法返回的必须是一个对象，否则会报错。

```javascript
var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});
(new p(1)).value
// "called: 1"
// 10
```

- deleteProperty()

  用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。注意，目标对象自身的不可配置的属性不能被deleteProperty方法删除，否则报错。

- defineProperty()

  主要用来拦截Object.defineProperty()操作。注意，如果目标对象不可扩展，则defineProperty()不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写或不可配置，则defineProperty()方法不得改变这两个设置。

- getOwnPropertyDescriptor()

​      主要用来拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。

- getPrototypeOf()

 主要用来拦截获取对象原型。具体来说，拦截下面这些操作：Object.prototype.__proto__、Object.prototype.isPrototypeOf()、Object.getPrototypeOf()、Reflect.getPrototypeOf()、instanceof。注意，getPrototypeOf()方法的返回值必须是对象或者null，否则报错。另外，如果目标对象不可扩展，getPrototypeOf()方法必须返回目标对象的原型对象。

- isExtensible()

​        用来拦截Object.isExtensible()操作。注意，该方法只能返回布尔值，否则返回值会被自动转为布尔值。该方法有一个强限制，它的返回值必须与目标对象的isExtensible属性保持一致，否则会抛出错误。

- ownKeys()

用来拦截对象自身属性的读取操作。具体来说，拦截以下操作：Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()、Object.keys()、for...in循环。注意，使用Object.keys()方法时，有三类属性会被ownKeys()方法自动过滤，不会返回：①目标对象上不存在的属性、②属性名为Symbol值、③不可遍历的属性。ownKeys()方法返回的数组成员只能是字符串或Symbol值，如果有其他类型的值或者返回的根本不是数组，就会报错。如果目标对象自身包含不可配置的属性，则该属性必须被ownKeys()方法返回，否则报错。另外，如果目标对象是不可扩展的，这时ownKeys()方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错。

- preventExtensions()

 主要用来拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值。这个方法有一个限制，只有目标对象不可扩展时(即Object.isExtensible(proxy)为false)，proxy.preventExtensions才能返回true，否则会报错。为了防止出现这个问题，通常要在proxy.preventExtensions()方法里面，调用一次Object.preventExtensions()。

- setPrototypeOf()

​        主要用来拦截Object.setPrototypeOf()方法。注意，该方法只能返回布尔值，否则会被自动转为布尔值。另外，如果目标对象不可扩展，setPrototypeOf()方法不得改变目标对象的原型。

## Proxy.revocable()

  返回一个可取消的Proxy实例。Proxy.revocable()方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例。当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误。一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

```javascript
let target = {};
let handler = {};
let {proxy, revoke} = Proxy.revocable(target, handler);
proxy.foo = 123;
proxy.foo // 123
revoke();
proxy.foo // TypeError: Revoked
```

## this 问题

​        虽然Proxy可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在Proxy代理的情况下，目标对象内部的this关键字会指向Proxy代理。

```javascript
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};
//一旦proxy代理target.m，后者内部的this就是指向proxy，而不是target
const proxy = new Proxy(target, handler);
target.m() // false
proxy.m()  // true
```

​    有些原生对象的内部属性只有通过正确的this才能拿到，所以Proxy也无法代理这些原生对象的属性。

```javascript
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);
proxy.getDate(); // TypeError: this is not a Date object.
//getDate()只能在Date对象实例上面拿到，如果this不是Date对象实例就会报错。
//这时，this绑定原始对象就可以解决这个问题。
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      //每次调用proxy.getDate()，实际上会调用target.getDate()，但this是目标对象target
      return target.getDate.bind(target);//返回一个绑定到目标对象的方法
    }//由于target是一个日期对象，其getDate方法会返回该日期的日部分，日部分是1，所以返回数字1
    return Reflect.get(target, prop);//prop不是getDate，则用Reflect.get获取属性值
  }
};
const proxy = new Proxy(target, handler);
proxy.getDate() // 1
```

## 实例：Web 服务的客户端

​        Proxy对象可以拦截目标对象的任意属性，这使得它很合适用来写Web服务的客户端，也可以用来实现数据库的ORM层。

```javascript
function createWebService(baseUrl) {
  return new Proxy({}, {
    get(target, propKey, receiver) {
      return () => httpGet(baseUrl + '/' + propKey);
    }
  });
}
```