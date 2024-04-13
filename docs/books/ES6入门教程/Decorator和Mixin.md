---
title: Decorator和Mixin
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - JavaScript
---

## 1、类的装饰

​        装饰器可以用来装饰整个类。装饰器是一个对类进行处理的函数，装饰器函数的第一个参数就是所要装饰的目标类。注意，装饰器对类的行为的改变是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。

```javascript
@testable //一个装饰器
class MyTestableClass {
  // ...
}
function testable(target) { //参数target是MyTestableClass类本身，就是会被装饰的类
  target.isTestable = true; //修改了MyTestableClass这个类的行为，为它加上了静态属性isTestable
}
MyTestableClass.isTestable // true
//前面的例子是为类添加一个静态属性，如果想添加实例属性，可以通过目标类的prototype对象操作
function testable(target) {
  target.prototype.isTestable = true; //是在目标类的prototype对象上添加属性，因此可以在实例上调用
}
@testable
class MyTestableClass {}
let obj = new MyTestableClass();
obj.isTestable // true
```

​        基本上，装饰器的行为就是下面这样。

```javascript
@decorator
class A {}
// 等同于
class A {}
A = decorator(A) || A;
```

​        如果觉得一个参数不够用，可以在装饰器外面再封装一层函数。

```javascript
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}
@testable(true) //testable可以接受参数，这就等于可以修改装饰器的行为
class MyTestableClass {}
MyTestableClass.isTestable // true
@testable(false)
class MyClass {}
MyClass.isTestable // false
```

## 2、方法的装饰

​        装饰器不仅可以装饰类，还可以装饰类的属性。

```javascript
class Person {
  @readonly //装饰器readonly用来装饰类的name方法
  name() { return `${this.first} ${this.last}` }
}
```

​        装饰器会修改属性的描述对象，然后被修改的描述对象再用来定义属性。

```javascript
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}
readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor);
```

​        装饰器函数readonly一共可以接受三个参数。第一个参数是类的原型对象，装饰器的本意是要装饰类的实例，但是这个时候实例还没生成，所以只能去装饰原型(这不同于类的装饰，那种情况时target参数指的是类本身)；第二个参数是所要装饰的属性名，第三个参数是该属性的描述对象。

​        如果同一个方法有多个装饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。

```javascript
function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id);
}
class Example {
    @dec(1)
    @dec(2)
    method(){}
} //外层装饰器@dec(1)先进入，但是内层装饰器@dec(2)先执行
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```

​        除了注释，装饰器还能用来类型检查。所以，对于类来说，这项功能相当有用。从长期来看，它将是JavaScript代码静态分析的重要工具。

## 3、为什么装饰器不能用于函数？

​        装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。类是不会提升的，所以就没有这方面的问题。

```javascript
var counter = 0;
var add = function () {
  counter++; //意图是执行后counter等于1
};
@add
function foo() {
} //但是实际上结果是counter等于0，因为函数提升
```

​        如果一定要装饰函数，可以采用高阶函数的形式直接执行。

```javascript
function doSomething(name) {
  console.log('Hello, ' + name);
}
function loggingDecorator(wrapped) {
  return function() {
    console.log('Starting');
    const result = wrapped.apply(this, arguments);
    console.log('Finished');
    return result;
  }
}
const wrapped = loggingDecorator(doSomething);
```

## 4、core-decorators.js

​        是一个第三方模块，提供了几个常见的装饰器，通过它可以更好地理解装饰器。

@autobind：autobind装饰器使得方法中的this对象绑定原始对象。

@readonly：readonly装饰器使得属性或方法不可写。

@override：override装饰器检查子类的方法是否正确覆盖了父类的同名方法，如果不正确会报错。

@deprecate (别名@deprecated)：deprecate或deprecated装饰器在控制台显示一条警告，表示该方法将废除。

@suppressWarnings：suppressWarnings装饰器抑制deprecated装饰器导致的console.warn()调用。但是，异步代码发出的调用除外。

## 5、使用装饰器实现自动发布事件

​        我们可以使用装饰器使得对象的方法被调用时，自动发出一个事件。

```javascript
const postal = require("postal/lib/postal.lodash");
export default function publish(topic, channel) { //定义了一个名为publish的装饰器
  const channelName = channel || '/';
  const msgChannel = postal.channel(channelName);
  msgChannel.subscribe(topic, v => {
    console.log('频道: ', channelName);
    console.log('事件: ', topic);
    console.log('数据: ', v);
  });
  return function(target, name, descriptor) {
    const fn = descriptor.value; //改写descriptor.value使得原方法被调用时自动发出一个事件
    descriptor.value = function() {
      let value = fn.apply(this, arguments);
      msgChannel.publish(topic, value);
    };
  };
}
//它使用的事件“发布/订阅”库是Postal.js，用法如下
// index.js
import publish from './publish';
class FooComponent {
  @publish('foo.some.message', 'component')
  someMethod() {
    return { my: 'data' };
  }
  @publish('foo.some.other')
  anotherMethod() {
    // ...
  }
}
let foo = new FooComponent();
foo.someMethod();
foo.anotherMethod();
//以后，只要调用someMethod或者anotherMethod，就会自动发出一个事件。
$ bash-node index.js
频道:  component
事件:  foo.some.message
数据:  { my: 'data' }
频道:  /
事件:  foo.some.other
数据:  undefined
```

## 6、Mixin

​        在装饰器的基础上，可以实现Mixin模式。所谓Mixin模式就是对象继承的一种替代方案，中文译为混入，意为在一个对象中混入另外一个对象的方法。

```javascript
const Foo = {
  foo() { console.log('foo') }
};
class MyClass {}
Object.assign(MyClass.prototype, Foo); //通过Object.assign方法可将foo方法混入MyClass类
let obj = new MyClass();
obj.foo() // 'foo' 导致MyClass的实例obj对象都具有foo方法
```

​        我们可以部署一个通用脚本mixins.js，将Mixin写成一个装饰器，然后就可以使用这个装饰器为类混入各种方法，但是这样会改写类的prototype对象，如果不喜欢这一点，可通过类的继承实现Mixin。

​        如果需要混入多个方法，就生成多个混入类。

```javascript
class MyClass extends Mixin1(Mixin2(MyBaseClass)) {
  /* ... */
} //这种写法的一个好处是可以调用super，因此可以避免在混入过程中覆盖父类的同名方法。
```

## 7、Trait

​        也是一种装饰器，效果与Mixin类似，但是提供更多功能，比如防止同名方法的冲突、排除混入某些方法、为混入的方法起别名等等。

```javascript
import { traits } from 'traits-decorator';
class TFoo {
  foo() { console.log('foo') }
}
const TBar = {
  bar() { console.log('bar') }
};
@traits(TFoo, TBar) //通过traits装饰器在MyClass类上混入了TFoo类的foo方法和TBar对象的bar方法
class MyClass { }
let obj = new MyClass();
obj.foo() // foo
obj.bar() // bar
```

​        Trait不允许混入同名方法。一种解决方法是使用绑定运算符(::)在类中排除其中一个方法，另一种方法是为其中一个方法起一个别名。alias和excludes方法可以结合起来使用。

```javascript
@traits(TExample::excludes('foo','bar')::alias({baz:'exampleBaz'}))
class MyClass {} //排除了TExample的foo方法和bar方法，为baz方法起了别名exampleBaz
//as方法则为上面的代码提供了另一种写法
@traits(TExample::as({excludes:['foo', 'bar'], alias: {baz: 'exampleBaz'}}))
class MyClass {}
```

> ​        函数绑定运算符(::)是一种用于将一个对象绑定到函数上下文中的运算符。它通常用于将一个对象作为上下文环境(this对象)绑定到函数上，以便在函数中引用该对象的属性和方法。
> ​        在JavaScript中，使用函数绑定运算符可以将一个对象绑定到一个函数上***，以便在函数内部使用this关键字来*访问该对象的属性和方法。还可以用于将对象的方法绑定到对象本身上***，可以更方便地*调用该方法并*利用对象的属性。

# Mixin

​        Mixin允许向一个类里面注入一些代码，使得一个类的功能能够混入另一个类。实质上是多重继承的一种解决方案，但是避免了多重继承的复杂性，而且有利于代码复用。

​        Mixin就是一个正常的类，不仅定义了接口，还定义了接口的实现。子类通过在this对象上面绑定方法，达到多重继承的目的。

## Trait

​        Trait是另外一种多重继承的解决方案。它与Mixin很相似，但是有一些细微的差别。

- Mixin可以包含状态(state)，Trait不包含，即Trait里面的方法都是互不相干，可以线性包含的。比如，Trait1包含方法A和B，Trait2继承了Trait1，同时还包含一个自己的方法C，实际上就等同于直接包含方法A、B、C。
- 对于同名方法的碰撞，Mixin包含了解决规则，Trait则是报错。