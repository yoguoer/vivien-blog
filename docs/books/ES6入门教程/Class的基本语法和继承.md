---
title: Class的基本语法和继承
author: vivien
date: '2024-01-31'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - JavaScript
---

## 简介

### 类的由来

​        ES6提供了更接近传统语言的写法，引入了Class(类)这个概念作为对象的模板。通过class关键字，可以定义类。基本上，它可以看作只是一个语法糖，它的绝大部分功能ES5都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```javascript
class Point { //constructor方法就是构造方法，而this关键字则代表实例对象
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
//注意，定义类的方法时，前面不需加上function，直接把函数定义放进去就行，方法间不需逗号分隔，加了会报错
```

​        ES6的类，完全可以看作构造函数的另一种写法，类的数据类型就是函数，类本身就指向构造函数。使用的时候，也是直接对类使用new命令，跟构造函数的用法完全一致。

```javascript
class Bar {
  doStuff() {
    console.log('stuff');
  }
}
var b = new Bar();
b.doStuff() // "stuff"
```

   构造函数的prototype属性在ES6的类上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。在类的实例上面调用方法，其实就是调用原型上的方法。

```javascript
class Point {
  constructor() {
    // ...
  }
  toString() {
    // ...
  }
  toValue() {
    // ...
  }
}
// 等同于   
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
}; //在类的实例上面调用方法，其实就是调用原型上的方法
class B {}
let b = new B();
b.constructor === B.prototype.constructor // true。b是B类的实例，它的constructor方法就是B类原型的constructor方法
```

​        由于类的方法都定义在prototype对象上面，所以类的新方法可以添加在prototype对象上面。Object.assign方法可以很方便地一次向类添加多个方法。类的内部所有定义的方法都是不可枚举的。

```javascript
class Point {
  constructor(){
    // ...
  }
  toString() {
    // ...
  }
}
Object.assign(Point.prototype, { 
  toNumber(){}, //很方便地一次向类添加多个方法
  toValue(){}
});
//prototype对象的constructor属性直接指向类的本身，这与ES5的行为是一致的。
Point.prototype.constructor === Point // true
//toString方法是Point类内部定义的方法，它是不可枚举的，这一点与ES5的行为不一致。
Object.keys(Point.prototype) // []
//如下代码所示，采用ES5的写法，toString方法就是可枚举的
var Point = function (x, y) { // ... };
Point.prototype.toString = function() { // ... };
Object.keys(Point.prototype)// ["toString"]
```

### constructor() 方法

​       类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。

```javascript
class Point {
}
// 等同于
class Point {
  constructor() {}
} //定义了一个空的类Point，JavaScript引擎会自动为它添加一个空的constructor方法
```

​        constructor方法默认返回实例对象(即this)，完全可以指定返回另外一个对象。

```javascript
class Foo {
  constructor() {
    return Object.create(null); //constructor函数返回一个全新的对象，导致实例对象不是Foo类的实例
  }
}
new Foo() instanceof Foo // false
```

### 类的实例

​         生成类的实例的写法与ES5完全一样，也是使用new命令。如果忘记加上new，像函数那样调用Class，将会报错。与ES5一样，实例的属性除非显式定义在其本身(即定义在this对象上)，否则都是定义在原型上(即定义在class上)。

​    类的所有实例共享一个原型对象，即__proto__属性是相等的。这也意味着，可以通过实例的__proto__属性为类添加方法。使用实例的__proto__属性改写原型必须相当谨慎，不推荐使用，因为这会改变类的原始定义，影响到所有实例。

```javascript
var p1 = new Point(2,3);
var p2 = new Point(3,2);
p1.__proto__.printName = function () { return 'Oops' };
p1.printName() // "Oops" 在p1的原型上添加了一个printName方法
p2.printName() // "Oops" 由于p1的原型就是p2的原型，因此p2也可以调用这个方法
var p3 = new Point(4,2);
p3.printName() // "Oops" 此后新建的实例p3也可以调用这个方法
```

### 取值函数（getter）和存值函数（setter）

​        在类的内部可以用get和set关键字对某个属性设置存值函数和取值函数，拦截该属性的存取行为。存值函数和取值函数是设置在属性的Descriptor对象上的。

```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}
let inst = new MyClass();
inst.prop = 123; // setter: 123
inst.prop // 'getter'
```

### 属性表达式

​        类的属性名可以采用表达式。

```javascript
let methodName = 'getArea';
class Square {
  constructor(length) {
    // ...
  }
  [methodName]() {
    // ...
  }
} //Square类的方法名getArea是从表达式得到的
```

### Class 表达式

​        与函数一样，类也可以使用表达式的形式定义。

```javascript
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
}; //Me只在Class的内部可用，指代当前类，在Class外部，这个类只能用MyClass引用
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
//如果类的内部没用到的话，可以省略Me，也就是可以写成下面的形式。
const MyClass = class { /* ... */ };
```

​        采用Class表达式，可以写出立即执行的Class。

```javascript
let person = new class {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}('张三'); //person是一个立即执行的类的实例
person.sayName(); // "张三"
```

### 类的注意点

- ***\*严格模式\****：类和模块的内部默认就是严格模式，所以不需要使用use strict指定运行模式。只要代码写在类或模块中，就只有严格模式可用。考虑到未来所有的代码其实都是运行在模块中，所以ES6实际上把整个语言升级到了严格模式。
- ***\*不存在提升\****：类不存在变量提升(hoist)，这一点与ES5完全不同。 ES6不会把类的声明提升到代码头部，因为必须保证子类在父类之后定义。

```javascript
{
  let Foo = class {};
  class Bar extends Foo { //Bar继承Foo的时候，Foo已经有定义了
  }
}//如果存在class的提升，就会报错，因为class会被提升到代码头部，而let命令是不提升的，所以导致Bar继承Foo的时候，Foo还没有定义
```

- ***\*name 属性\****：由于本质上，ES6的类只是ES5的构造函数的一层包装，所以函数的许多特性都被Class继承，包括name属性。name属性总是返回紧跟在class关键字后面的类名。

```javascript
class Point {}
Point.name // "Point"
```

- ***\*Generator 方法\****：如果某个方法之前加上星号(*)，就表示该方法是一个Generator函数。
- ***\*this 的指向\****：类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。有三种解决方法：在构造方法中绑定this、使用箭头函数、使用Proxy。

```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }
  print(text) {
    console.log(text);
  }
}
const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
//printName方法中的this默认指向Logger类的实例，但是如果将这个方法提取出来单独使用，
//this会指向该方法运行时所在的环境(class内部是严格模式，this实际指向的是undefined)，从而导致找不到print方法而报错
//①一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了。
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }
  // ...
}
//②另一种解决方法是使用箭头函数。
class Obj {
  constructor() {
    this.getThis = () => this; //箭头函数内部的this总是指向定义时所在的对象。
  }
}//箭头函数位于构造函数内部，它的定义生效时是在构造函数执行时，这时，箭头函数所在的运行环境肯定是实例对象，所以this会总是指向实例对象
const myObj = new Obj();
myObj.getThis() === myObj // true
//③还有一种解决方法是使用Proxy，获取方法的时候，自动绑定this。
function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}
const logger = selfish(new Logger());
```

## 静态方法

​        类相当于实例的原型，所有在类中定义的方法都会被实例继承。如果在一个方法前加上static关键字，就表示该方法不会被实例继承，不能通过实例调用，而是直接通过类来调用，这就称为静态方法。

​        如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。

​      注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。

​        静态方法可以与非静态方法重名，父类的静态方法可以被子类继承，静态方法也是可以从super对象上调用的。

## 实例属性的新写法

​        实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。这种新写法的好处是，所有实例对象自身的属性都定义在类的头部，看上去比较整齐，一眼就能看出这个类有哪些实例属性。

```javascript
class foo {
  bar = 'hello';
  baz = 'world';
  constructor() {
    // ...
  }
} //一眼就能看出foo类有两个实例属性，一目了然，写起来也比较简洁
```

## 静态属性

​        静态属性指的是Class本身的属性，即Class.propName，而不是定义在实例对象(this)上的属性。静态属性不能通过实例对象来访问，而是通过类本身来访问，不会被实例继承。写法是在实例属性的前面加上static关键字，这个新写法大大方便了静态属性的表达。

```javascript
// 老写法。老写法的静态属性定义在类的外部，整个类生成以后再生成静态属性。这样让人很容易忽略这个静态属性，也不符合相关代码应该放在一起的代码组织原则
class Foo {
  // ...
}
Foo.prop = 1;
// 新写法。显式声明(declarative)，而不是赋值处理，语义更好
class Foo {
  static prop = 1;
}
```

> ​         静态属性和方法可以被子类继承，但子类不能覆盖父类的静态属性和方法。在访问静态属性和方法时，可以通过类名来区分来自父类还是子类的静态属性和方法。
> ​        私有属性和私有方法不能被子类继承，它们只能被父类本身所使用和管理。只能在所属的类内部被访问和修改，而不能被其他类访问或继承，子类无法直接访问，因为它们在父类的外部是不可见的。

## 私有方法和私有属性

​        私有方法和私有属性是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但ES6不提供，只能通过变通方法模拟实现。

- ①一种做法是在命名上加以区别。

```javascript
class Widget {
  // 公有方法
  foo (baz) {
    this._bar(baz);
  }
  // 私有方法
  _bar(baz) {
    return this.snaf = baz;
  } //_bar前的下划线表示一个只限于内部使用的私有方法，但不保险，在类的外部还是可以调用到这个方法
  // ...
}
```

- ②一种方法就是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的。

```javascript
class Widget {
  foo (baz) { //foo是公开方法，内部调用了bar.call(this, baz)，使得bar实际上成为了当前模块的私有方法
    bar.call(this, baz);
  }
  // ...
}
function bar(baz) {
  return this.snaf = baz;
}
```

- ③一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值。

```javascript
const bar = Symbol('bar');
const snaf = Symbol('snaf');
export default class myClass{
  // 公有方法
  foo(baz) {
    this[bar](baz);
  }
  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  } //bar和snaf都是Symbol值，一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果
  // ...
};
//但也不是绝对不行，Reflect.ownKeys()依然可以拿到它们
const inst = new myClass(); //Symbol值的属性名依然可以从类的外部拿到
Reflect.ownKeys(myClass.prototype) // [ 'constructor', 'foo', Symbol(bar) ]
```

- 目前，有一个提案为class加了私有属性。方法是在属性名之前使用#表示，这种写法不仅可以写私有属性，还可以用来写私有方法。由于井号#是属性名的一部分，使用时必须带有#一起使用，所以#x和x是两个不同的属性。

```javascript
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count; //只能在里面用
  }
  increment() {
    this.#count++;
  }
} //#count就是私有属性，只能在类的内部使用(this.#count)，如果在类的外部使用就会报错
const counter = new IncreasingCounter(); //在类的外部，读取私有属性，就会报错
counter.#count // 报错
counter.#count = 42 // 报错
```

​      另外，私有属性也可以设置getter和setter方法。私有属性不限于从this引用，只要是在类的内部，实例也可以引用私有属性。私有属性和私有方法前面也可以加上static关键字，表示这是一个静态的私有属性或私有方法。

## new.target 属性

​        new是从构造函数生成实例对象的命令。ES6为new命令引入了一个new.target属性，该属性一般用在构造函数中，指向当前正在执行的函数，返回new命令作用于的那个构造函数。

​        如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。

```javascript
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}
// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}
var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
//上面代码确保构造函数只能通过new命令调用
```

​        Class内部调用new.target，会返回当前Class。注意，子类继承父类时，new.target会返回子类。利用这个特点，可以写出不能独立使用必须继承后才能使用的类。在函数外部使用new.target会报错。

```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}
class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}
var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```

# Class 的继承

## 简介

​        Class可以通过extends关键字实现继承，这比ES5的通过修改原型链实现继承要清晰和方便很多。

```javascript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }
  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
} //super关键字在这里表示父类的构造函数，用来新建父类的this对象。
```

​        子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。

ES5的继承实质是先创造子类的实例对象this，然后再将父类的方法添加到this上(Parent.apply(this))。ES6的继承实质是先将父类实例对象的属性和方法加到this上面(所以必须先调用super方法)，然后再用子类的构造函数修改this。

​        如果子类没有定义constructor方法，这个方法会被默认添加，也就是说，不管有没有显式定义，任何一个子类都有constructor方法。

```javascript
class ColorPoint extends Point {
}
// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```

​        在子类的构造函数中，只有调用super之后才可以使用this关键字，否则会报错。这是因为子类实例的构建基于父类实例，只有super方法才能调用父类实例。父类的静态方法也会被子类继承。

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}
```

## Object.getPrototypeOf()

​        可以用来从子类上获取父类。可以使用这个方法判断一个类是否继承了另一个类。

```javascript
Object.getPrototypeOf(ColorPoint) === Point // true
```

## super 关键字

​        super关键字既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

- 第一种情况，super作为函数调用时，代表父类的构造函数。ES6要求子类的构造函数必须执行一次super函数。作为函数时，super()只能用在子类的构造函数中，用在其他地方就会报错。

```javascript
class A {
  constructor() {
    console.log(new.target.name); //new.target指向当前正在执行的函数
  }
}
class B extends A {
  constructor() {
    super();
    m() { //super()用在B类的m方法中就会造成语法错误
      super(); // 报错
    }
  }
} //super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
new A() // A
new B() // B 在super()执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。
```

- 第二种情况，super作为对象时，①在普通方法中，指向父类的原型对象(所以此时，定义在父类实例上的方法或属性是无法通过super调用的)；②在静态方法中，指向父类。

```javascript
class A {
  constructor() {
    this.p = 2; //p是父类A实例的属性，super.p就引用不到它
  }
}
class B extends A {
  get m() {
    return super.p; //将super当作对象。这时，super在普通方法中，指向A.prototype，所以super.p()就相当于A.prototype.p()
  }
}
let b = new B();
b.m // undefined。p是父类A实例的属性，super.p就引用不到它。
//如果属性定义在父类的原型对象上，super就可以取到。
class A {}
A.prototype.x = 2; //x是定义在A.prototype上面的，所以super.x可以取到它的值
class B extends A {
  constructor() {
    super();
    console.log(super.x) // 2
  }
}
let b = new B();
```

​        在子类***\*普通方法中\****通过super调用父类的方法时，方法内部的this指向当前的子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
}
class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3; //super.x赋值为3，这时等同于对this.x赋值为3
    console.log(super.x); // undefined 当读取super.x时，读的是A.prototype.x，所以返回undefined
    console.log(this.x); // 3
  }
}
let b = new B();
```

​        如果super作为对象用在***\*静态方法中\****，这时super将指向父类，而不是父类的原型对象。

```javascript
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }
  myMethod(msg) {
    console.log('instance', msg);
  }
}
class Child extends Parent {
  static myMethod(msg) { 
    super.myMethod(msg); //super在静态方法中指向父类
  }
  myMethod(msg) {
    super.myMethod(msg); //super在普通方法中指向父类的原型对象
  }
}
Child.myMethod(1); // static 1  通过类直接调用，调用了静态方法
var child = new Child();
child.myMethod(2); // instance 2  通过实例调用调用了普通方法
```

​        另外，在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}
class B extends A {
  constructor() { //创建新实例的方法
    super();
    this.x = 2;
  }
  static m() { //静态方法
    super.print(); //指向父类的静态方法，这个方法里面的this指向的是B，而不是B的实例
  }
}
B.x = 3;
B.m() // 3
```

​         注意，使用super的时候，必须显式指定是作为函数还是作为对象使用，否则会报错。由于对象总是继承其他对象的，所以可以在任意一个对象中使用super关键字。

## 类的 prototype 属性和__proto__属性

​     大多数浏览器的ES5实现中，每个对象都有__proto__属性，指向对应的构造函数的prototype属性。

​      Class作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。

- ***\*子类的__proto__属性\****：表示构造函数的继承，总是指向父类。
- ***\*子类prototype属性的__proto__属性\****：表示方法的继承，总是指向父类的prototype属性。

```javascript
class A {
}
class B extends A {
}
B.__proto__ === A // true。子类B的__proto__属性指向父类A
B.prototype.__proto__ === A.prototype // true。子类B的prototype属性的__proto__属性指向父类A的prototype
//这样的结果是因为，类的继承是按照下面的模式实现的
class A {
}
class B {
}
Object.setPrototypeOf(B.prototype, A.prototype); //B的实例继承A的实例
Object.setPrototypeOf(B, A); //B继承A的静态属性
const b = new B();
```

​        两条继承链

```javascript
//作为一个对象，子类B的原型(__proto__属性)是父类A------------------------------------
Object.setPrototypeOf(B.prototype, A.prototype); // B的实例继承A的实例
// 等同于
B.prototype.__proto__ = A.prototype;//-----------------------------------------
//作为一个构造函数，子类B的原型对象(prototype属性)是父类的原型对象(prototype属性)的实例
Object.setPrototypeOf(B, A); //B继承A的静态属性
// 等同于
B.__proto__ = A;//-------------------------------------------------------------
B.prototype = Object.create(A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;
```

​        extends关键字后面可以跟多种类型的值。下面列举两种情况。

```javascript
class B extends A {
} //只要是一个有prototype属性的函数就能被B继承。由于函数都有prototype属性(除了Function.prototype函数)，因此A可以是任意函数
```

​        第一种情况，子类继承Object类。

```javascript
class A extends Object {
} //A其实就是构造函数Object的复制，A的实例就是Object的实例。
A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```

​        第二种情况，不存在任何继承。

```javascript
class A {
}//A作为一个基类(即不存在任何继承)，就是一个普通函数，所以直接继承Function.prototype。但是A调用后返回一个空对象(即Object实例)，所以A.prototype.__proto__指向构造函数(Object)的prototype属性
A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```

### 实例的 __proto__ 属性

​         子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性。也就是说，子类的原型的原型，是父类的原型。因此，通过子类实例的__proto__.__proto__属性，可以修改父类实例的行为。

```javascript
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
}; //在ColorPoint的实例p2上向Point类添加方法，结果影响到了Point的实例p1。
p1.printName() // "Ha"
```

## 原生构造函数的继承

​        原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ES6允许继承原生构造函数定义子类，因为ES6是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可继承。这意味着ES6可以自定义原生数据结构(比如Array、String等)的子类，这是ES5无法做到的。

​        ECMAScript的原生构造函数大致有下面这些。

- Boolean()
- Number()
- String()
- Array()
- Date()
- Function()
- RegExp()
- Error()
- Object()

​         注意，继承Object的子类无法通过super方法向父类Object传参。 ES6改变了Object构造函数的行为，一旦发现Object方法不是通过new Object()这种形式调用，Object构造函数会忽略参数。

## Mixin 模式的实现

​        Mixin指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。可以将多个对象合成为一个类，使用的时候只要继承这个类即可。

```javascript
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}  c对象是a对象和b对象的合成，具有两者的接口
```