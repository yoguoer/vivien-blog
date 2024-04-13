---
title: symbol类型和对象
author: vivien
date: '2024-04-08'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Note
tags:       # 标签
 - TypeScript
---

## symbol 类型

​       类似于字符串，但是每一个Symbol值都是独一无二的，与其他任何值都不相等。Symbol 值通过Symbol()函数生成。在 TypeScript 里面，Symbol 的类型使用symbol表示。

```typescript
let x:symbol = Symbol();
let y:symbol = Symbol();
x === y // false。变量x和y的类型都是symbol，且都用Symbol()生成，但是它们是不相等的
```

## unique symbol

​        symbol类型包含所有的Symbol值，但是无法表示某一个具体的Symbol值。Symbol值不存在字面量，必须通过变量来引用，所以写不出只包含单个Symbol值的那种值类型。为了解决这个问题，

​       TypeScript设计了symbol的一个子类型unique symbol，它表示单个的、某个具体的 Symbol 值。因为unique symbol表示单个值，所以这个类型的变量是不能修改值的，只能用const命令声明，不能用let声明。const命令为变量赋值Symbol值时，变量类型默认就是unique symbol，所以类型可以省略不写。

```typescript
const x:unique symbol = Symbol();// 正确
let y:unique symbol = Symbol();// 报错
const x:unique symbol = Symbol();
// 等同于
const x = Symbol();
```

​        每个声明为unique symbol类型的变量，它们的值都是不一样的，其实属于两个值类型。

```typescript
const a:unique symbol = Symbol();
const b:unique symbol = Symbol();
a === b // 报错。变量a和变量b都是unique symbol，但其实是两个值类型，不同类型的值肯定是不相等的
const a:'hello' = 'hello';
const b:'world' = 'world';
a === b // 报错。变量a和b都是字符串，但属于不同的值类型，不能使用严格相等运算符进行比较
```

​         unique symbol 类型是 symbol 类型的子类型，所以可以将前者赋值给后者，但是反过来就不行。

​        unique symbol 类型的一个作用，就是用作属性名，这可以保证不会跟其他属性名冲突。如果要把某一个特定的 Symbol 值当作属性名，那么它的类型只能是 unique symbol，不能是 symbol。

​        unique symbol类型也可以用作类（class）的属性值，但只能赋值给类的readonly static属性。

## 类型推断

​        如果变量声明时没有给出类型，TypeScript会推断某个Symbol值变量的类型。

​        let命令声明的变量，推断类型为symbol。此时，如果赋值为另一个unique symbol类型的变量，则推断类型还是 symbol。

```typescript
let x = Symbol(); // 类型为 symbol
const x = Symbol();
let y = x;// 类型为 symbol
```

​        const命令声明的变量，推断类型为unique symbol。此时，如果赋值为另一个symbol类型的变量，则推断类型为symbol。

```typescript
const x = Symbol(); // 类型为 unique symbol
let x = Symbol();
const y = x; // 类型为 symbol
```

## 对象

​       对象类型的最简单声明方法，就是使用大括号表示对象，在大括号内部声明每个属性和方法的类型。属性的类型可以用分号结尾，也可以用逗号结尾，最后一个属性后面，可以写分号或逗号，也可以不写。

​        一旦声明了类型，对象赋值时，就不能缺少指定的属性，也不能有多余的属性。读写不存在的属性也会报错。不能删除类型声明中存在的属性，修改属性值是可以的。

```typescript
// 属性类型以分号结尾
type MyObj = {
  x:number;
  y:number; 
};
// 属性类型以逗号结尾
type MyObj = {
  x:number,
  y:number,
};
const o1:MyObj = { x: 1 }; // 报错。变量o1缺少了属性y
const o2:MyObj = { x: 1, y: 1, z: 1 }; // 报错。变量o2多出了属性z
```

​        对象的方法使用函数类型描述。

```typescript
const obj:{
  x: number;
  y: number;
  add(x:number, y:number): number;
  // 或者写成
  // add: (x:number, y:number) => number;
} = {
  x: 1,
  y: 1,
  add(x, y) {
    return x + y;
  }
};
```

​        对象类型可以使用方括号读取属性的类型。

```typescript
type User = {
  name: string,
  age: number
};
type Name = User['name']; // string
```

​        除了type命令可以为对象类型声明一个别名，TypeScript还提供了interface命令，可以把对象类型提炼为一个接口。

```typescript
// 写法一 type命令的用法
type MyObj = {
  x:number;
  y:number;
};
const obj:MyObj = { x: 1, y: 1 };
// 写法二 interface命令的用法
interface MyObj {
  x: number;
  y: number;
}
const obj:MyObj = { x: 1, y: 1 };
```

​        注意，TypeScript不区分对象自身的属性和继承的属性，一律视为对象的属性。

```typescript
interface MyInterface {
  toString(): string; // 继承的属性
  prop: number; // 自身的属性
}
const obj:MyInterface = { // 正确
  prop: 123, // 只写了prop属性，但不报错，因为它可以继承原型上面的toString()方法
};
```

## 可选属性

​        如果某个属性是可选的（即可以忽略），需要在属性名后面加一个问号。可选属性等同于允许赋值为undefined。

```typescript
type User = {
  firstName: string;
  lastName?: string;
};
// 等同于
type User = {
  firstName: string;
  lastName?: string|undefined;
};
```

​        读取一个没有赋值的可选属性时，返回undefined。因此，读取可选属性之前，必须检查一下是否为undefined。

```typescript
// 写法一 使用三元运算符?:，判断是否为undefined，并设置默认值
let firstName = (user.firstName === undefined)
  ? 'Foo' : user.firstName;
let lastName = (user.lastName === undefined)
  ? 'Bar' : user.lastName;
// 写法二 使用 Null 判断运算符??
let firstName = user.firstName ?? 'Foo';
let lastName = user.lastName ?? 'Bar';
```

​          TS提供编译设置ExactOptionalPropertyTypes，只要同时打开这个设置和strictNullChecks，可选属性就不能设为undefined。

​        注意，可选属性与允许设为undefined的必选属性是不等价的。

```typescript
type A = { x:number, y?:number }; //一个可选属性，可以省略不写
type B = { x:number, y:number|undefined }; //允许设为undefined的必选属性，省略会报错
const ObjA:A = { x: 1 }; // 正确
const ObjB:B = { x: 1 }; // 报错
```

## 只读属性

​        属性名前面加上readonly关键字，表示这个属性是只读属性，不能修改。只读属性只能在对象初始化期间赋值，此后就不能修改该属性。注意，如果属性值是一个对象，readonly修饰符并不禁止修改该对象的属性，只是禁止完全替换掉该对象。

​        如果一个对象有两个引用，即两个变量对应同一个对象，其中一个变量是可写的，另一个变量是只读的，那么从可写变量修改属性，会影响到只读变量。

​        如果希望属性值是只读的，除了声明时加上readonly关键字，还有一种方法，就是在赋值时，在对象后面加上只读断言as const。

## 属性名的索引类型

​        TypeScript允许采用属性名表达式的写法来描述类型，称为“属性名的索引类型”。

```typescript
//索引类型里面，最常见的就是属性名的字符串索引。
type MyObj = { // 属性名类型采用了表达式形式，写在方括号里面
  [property: string]: string // 指定所有名称为字符串的属性，属性值也必须是字符串
};
const obj:MyObj = {
  foo: 'a',
  bar: 'b',
  baz: 'c',
};
```

​        JavaScript 对象的属性名的类型有三种可能，除了string，还有number和symbol。

​        对象可以同时有多种类型的属性名索引，比如同时有数值索引和字符串索引。但是，数值索引不能与字符串索引发生冲突，必须服从后者，这是因为在JavaScript语言内部，所有的数值属性名都会自动转为字符串属性名。

```typescript
type MyType = { // 同时有两种属性名索引
  [x: number]: boolean; // 报错
  [x: string]: string;
} // 由于字符属性名的值类型是string，数值属性名的值类型只有同样为string，才不会报错
```

​        同样地，可以既声明属性名索引，也声明具体的单个属性名。如果单个属性名不符合属性名索引的范围，两者发生冲突，就会报错。

```typescript
type MyType = {
  foo: boolean; // 报错
  [x: string]: string;
} // 属性名foo符合属性名的字符串索引，但是两者的属性值类型不一样，所以报错
```

> 属性的索引类型写法，建议谨慎使用，因为属性名的声明太宽泛，约束太少。另外，属性名的数值索引不宜用来声明数组，因为采用这种方式声明数组，就不能使用各种数组方法以及length属性，因为类型里面没有定义这些东西。

## 解构赋值

​        解构赋值用于直接从对象中提取属性。

```typescript
const {id, name, price}:{
  id: string;
  name: string;
  price: number
} = product; // 从对象product提取了三个属性，并声明属性名的同名变量
```

​        注意，目前没法为解构变量指定类型，因为对象解构里面的冒号，很像是为变量指定类型，其实是为对应的属性指定新的变量名。

```typescript
let { x: foo, y: bar } = obj; //冒号不是表示属性x和y的类型，而是为这两个属性指定新的变量名
// 等同于
let foo = obj.x;
let bar = obj.y;
//如果要为x和y指定类型，不得不写成下面这样
let { x: foo, y: bar }
  : { x: string; y: number } = obj;
```

## 结构类型原则

​        只要对象B满足对象A的结构特征，TypeScript就认为对象B兼容对象A的类型，这称为结构类型原则（structural typing）。只要可以使用A的地方，就可以使用B。

```typescript
type A = {
  x: number;
};
type B = { // B满足A的结构特征，B可以赋值给A
  x: number;
  y: number;
};
const B = {
  x: 1,
  y: 1
};
const A:{ x: number } = B; // 正确
```

​        根据结构类型原则，TypeScript检查某个值是否符合指定类型时，并不是检查这个值的类型名(即名义类型)，而是检查这个值的结构是否符合要求(即结构类型)。JavaScript 并不关心对象是否严格相似，只要某个对象具有所要求的属性，就可以正确运行。

> ​        如果类型B可以赋值给类型A，TypeScript就认为B是A的子类型，A是B的父类型。子类型满足父类型的所有结构特征，同时还具有自己的特征。凡是可以使用父类型的地方，都可以使用子类型，即子类型兼容父类型。

## 严格字面量检查

​        如果对象使用字面量表示，会触发TypeScript的严格字面量检查。如果字面量的结构跟类型定义的不一样(比如多出了未定义的属性)，就会报错。 

```typescript
const point:{
  x:number;
  y:number;
} = { // 等号右边是一个对象的字面量，会触发严格字面量检查，有类型声明中不存在的属性z，导致报错
  x: 1,
  y: 1,
  z: 1 // 报错
};
const myPoint = {
  x: 1,
  y: 1,
  z: 1
};
const point:{
  x:number;
  y:number;
} = myPoint; // 正确。等号右边是一个变量，就不会触发严格字面量检查，从而不报错
```

​        TypeScript对字面量进行严格检查的目的，主要是防止拼写错误。一般来说，字面量大多数来自手写，容易出现拼写错误，或者误用 API。

```typescript
type Options = {
  title:string;
  darkMode?:boolean; //如果没有严格字面量规则，就不会报错，因为darkMode是可选属性
};
const obj:Options = { //根据结构类型原则，任何对象只要有title属性，都认为符合Options类型
  title: '我的网页',
  darkmode: true, // 报错
};
```

​        规避严格字面量检查，可以使用中间变量。

```typescript
let myOptions = {
  title: '我的网页',
  darkmode: true,
};
const obj:Options = myOptions; //这时变量obj的赋值，不属于直接字面量赋值
```

​        如果确认字面量没有错误，也可以使用类型断言as Options规避严格字面量检查。告诉编译器，字面量符合Options类型，就能规避这条规则。

```typescript
const obj:Options = {
  title: '我的网页',
  darkmode: true,
} as Options; //使用类型断言as Options告诉编译器，字面量符合Options类型就能规避这条规则
```

​       如果允许字面量有多余属性，可以在类型里面定义一个通用属性。

```typescript
let x: {
  foo: number,
  [x: string]: any //字符串索引（[x: string]）导致任何字符串属性名都是合法的
};
x = { foo: 1, baz: 2 };  // Ok
```

​       由于严格字面量检查，字面量对象传入函数必须很小心，不能有多余的属性。

​        编译器选项suppressExcessPropertyErrors，可以关闭多余属性检查。下面是它在 tsconfig.json 文件里面的写法。

```typescript
{
  "compilerOptions": {
    "suppressExcessPropertyErrors": true
  }
}
```

## 最小可选属性规则

​        根据结构类型原则，如果一个对象的所有属性都是可选的，那么其他对象跟它都是结构类似的。为了避免这种情况，TypeScript 2.4引入了一个最小可选属性规则，也称为弱类型检测。

​        如果某个类型的所有属性都是可选的，那么该类型的对象必须至少存在一个可选属性，不能所有可选属性都不存在，这就叫做“最小可选属性规则”。

```typescript
type Options = {
  a?:number;
  b?:number;
  c?:number;
};
const opts = { d: 123 };
const obj:Options = opts; // 报错。对象opts与类型Options没有共同属性，赋值给该类型的变量就会报错
```

​        如果想规避这条规则，要么在类型里面增加一条索引属性（[propName: string]: someType），要么使用类型断言（opts as Options）。

## 空对象

​        空对象是TypeScript的一种特殊值，也是一种特殊类型。空对象没有自定义属性，所以对自定义属性赋值就会报错。空对象只能使用继承的属性，即继承自原型对象Object.prototype的属性。

```typescript
const obj = {};
obj.prop = 123; // 报错。变量obj的值是一个空对象，然后对obj.prop赋值就会报错
// TypeScript会推断变量obj的类型为空对象，实际执行的是下面的代码
const obj:{} = {};
obj.toString() // 正确。toString()是一个继承自原型对象的方法，TS允许在空对象上使用
```

​        TypeScript 不允许动态添加属性，所以对象不能分步生成，必须生成时一次性声明所有属性。如果确实需要分步声明，一个比较好的方法是，使用扩展运算符（...）合成一个新对象。

```typescript
const pt0 = {};
const pt1 = { x: 3 };
const pt2 = { y: 4 };
const pt = {
  ...pt0, ...pt1, ...pt2
}; // 对象pt是三个部分合成的，这样既可以分步声明，也符合TypeScript静态声明的要求
```

​        空对象作为类型，其实是Object类型的简写形式。又因为Object可以接受各种类型的值，所以它不会有严格字面量检查，赋值时总是允许多余的属性，只是不能读取这些属性。

```typescript
let d:{};
// 等同于
let d:Object;
//各种类型的值（除了null和undefined）都可以赋值给空对象类型，跟Object类型的行为是一样的
d = {};
d = { x: 1 };
d = 'hello';
d = 2;
```

​        如果想强制使用没有任何属性的对象，可以采用下面的写法。

```typescript
interface WithoutProperties {
  [key: string]: never; //表示字符串属性名是不存在的
}
// 报错
const a:WithoutProperties = { prop: 1 }; //因此其他对象进行赋值时就会报错
```