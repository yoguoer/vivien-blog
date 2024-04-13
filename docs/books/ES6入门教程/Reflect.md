---
title: Reflect
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - JavaScript
---

> ​        Reflect是一个内置的对象，它提供了一系列方法，使开发者能够通过调用这些方法来访问JavaScript的一些底层功能。由于它类似于其他语言的反射，因此取名为Reflect。它是一个全局的普通对象，其原型是Object，主要作用是将Object对象的一些明显属于语言内部的方法转移到Reflect对象上，使得这些方法可以从Reflect对象上被调用。这样做有助于使代码更加清晰和易于管理。

  Reflect对象与Proxy对象一样，也是ES6为了操作对象而提供的新API。设计目的：

- 将Object对象的一些明显属于语言内部的方法(比如Object.defineProperty)放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。
- 修改某些Object方法的返回结果，让其变得更合理。比如Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
- 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name],而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
- Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

## 静态方法

​        Reflect对象一共有13个静态方法。这些方法的作用，大部分与Object对象的同名方法的作用都是相同的，而且它与Proxy对象的方法是一一对应的。

- Reflect.get(target, name, receiver)

  查找并返回target对象的name属性，如果没有该属性，则返回undefined。如果name属性部署了读取函数(getter)，则读取函数的this绑定receiver。如果第一个参数不是对象，会报错。

- Reflect.set(target, name, value, receiver)

  设置target对象的name属性等于value。如果name属性设置了赋值函数，则赋值函数的this绑定receiver。注意，如果 Proxy对象和 Reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。如果Reflect.set没有传入receiver，那么就不会触发defineProperty拦截。如果第一个参数不是对象，会报错。

> receiver参数代表的是实际调用者，也就是最初调用该方法的对象。在Reflect.set方法中，如果传入了receiver参数，那么该属性值将被设置到receiver上，而不是目标对象上。

- Reflect.has(target, name)

  对应name in obj里面的in运算符。如果第一个参数不是对象，会报错。

- Reflect.deleteProperty(target, name)

 等同于delete obj[name]，用于删除对象的属性。该方法返回一个布尔值。如果删除成功或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false。如果第一个参数不是对象，会报错。

- Reflect.construct(target, args)

  等同于new target(...args)，这提供了一种不使用new来调用构造函数的方法。如果第一个参数不是函数，会报错。

- Reflect.getPrototypeOf(target)

  用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。如果参数不是对象，Object.getPrototypeOf会将这个参数转为对象，然后再运行，而Reflect.getPrototypeOf会报错。

- Reflect.setPrototypeOf(target, prototype)

  用于设置目标对象的原型（prototype），对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。

  如果无法设置目标对象的原型(比如目标对象禁止扩展)，Reflect.setPrototypeOf方法返回false。如果第一个参数不是对象，Object.setPrototypeOf会返回第一个参数本身，Reflect.setPrototypeOf会报错。如果第一个参数是undefined或null，Object.setPrototypeOf和Reflect.setPrototypeOf都报错。

- Reflect.apply(target, thisArg, args)

   等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。一般来说，如果要绑定一个函数的this对象，可这样写fn.apply(obj, args)，但如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，用Reflect对象简化这种操作。

- Reflect.defineProperty(target, name, desc)

  基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。如果Reflect.defineProperty的第一个参数不是对象，就会抛出错误，比如Reflect.defineProperty(1, 'foo')。这个方法可以与Proxy.defineProperty配合使用。

- Reflect.getOwnPropertyDescriptor(target, name)

​      基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代后者。如果第一个参数不是对象，Object.getOwnPropertyDescriptor(1, 'foo')不报错，返回undefined，而Reflect.getOwnPropertyDescriptor(1, 'foo')会抛出错误，表示参数非法。

- Reflect.isExtensible(target)

  对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。如果参数不是对象，Object.isExtensible会返回false，因为非对象本来就是不可扩展的，而Reflect.isExtensible会报错。

- Reflect.preventExtensions(target)

  用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。如果参数不是对象，Object.preventExtensions在ES5环境报错，在ES6环境返回传入的参数，Reflect.preventExtensions会报错。

- Reflect.ownKeys(target)

  用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。如果第一个参数不是对象，会报错。

## 2、实例：使用 Proxy 实现观察者模式

  观察者模式指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。

```javascript
const person = observable({ //数据对象person是观察目标
  name: '张三',
  age: 20
});
function print() { //函数print是观察者
  console.log(`${person.name}, ${person.age}`)
}
observe(print); //一旦数据对象发生变化，print就会自动执行
person.name = '李四';
// 输出：李四, 20
```

  下面，使用Proxy写一个观察者模式的最简单实现，即实现observable和observe这两个函数。思路是observable函数返回一个原始对象的Proxy代理，拦截赋值操作，触发充当观察者的各个函数。

```javascript
const queuedObservers = new Set(); //先定义了一个Set集合
const observe = fn => queuedObservers.add(fn); //所有观察者函数都放进这个集合
const observable = obj => new Proxy(obj, {set}); //返回原始对象的代理
function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver); //拦截赋值操作
  queuedObservers.forEach(observer => observer()); //自动执行所有观察者
  return result;
}
```