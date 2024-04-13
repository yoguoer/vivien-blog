---
title: Enum、namespace和模块
author: vivien
date: '2024-04-08'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - TypeScript
---

## Enum 类型

​        TypeScript 设计了 Enum 结构，用来将相关常量放在一个容器里面，方便使用。

​        使用时，调用 Enum 的某个成员，与调用对象属性的写法一样，可以使用点运算符，也可以使用方括号运算符。

​        Enum 结构本身也是一种类型。Enum 结构的特别之处在于，它既是一种类型，也是一个值。绝大多数 TypeScript 语法都是类型语法，编译后会全部去除，但是 Enum 结构是一个值，编译后会变成 JavaScript 对象，留在代码中。由于 Enum 结构编译后是一个对象，所以不能有与它同名的变量（包括对象、函数、类等）。很大程度上，Enum 结构可以被对象的as const断言替代。

​        Enum结构较适合的场景是，成员的值不重要，名字更重要，从而增加代码的可读性和可维护性。

​        枚举项有两种类型：常数项（constant member）和计算所得项（computed member）。

## Enum 成员的值

​        Enum成员默认不必赋值，系统会从零开始逐一递增，按照顺序为每个成员赋值，比如0、1、2…但是也可以为 Enum成员显式赋值。如果只设定第一个成员的值，后面成员的值就会从这个值开始递增。

​        成员的值可以是任意数值，但不能是大整数（Bigint）。成员的值甚至可以相同。

​        Enum成员的值也可以使用计算式。

​        Enum成员值都是只读的，不能重新赋值。为了让这一点更醒目，通常会在enum关键字前面加上const修饰，表示这是常量，不能再次赋值。加上const，编译为JavaScript代码后，编译产物里面就没有生成对应的对象，而是把所有 Enum 成员出现的场合，都替换成对应的常量。

​        如果希望加上const关键词后，运行时还能访问 Enum 结构(即编译后依然将 Enum 转成对象)，需要在编译时打开preserveConstEnums编译选项。

## 同名 Enum 的合并

​        多个同名的 Enum 结构会自动合并。同名 Enum 合并时，不能有同名成员，否则报错。所有定义必须同为 const 枚举或者非 const 枚举，不允许混合使用。同名 Enum 的合并，最大用处就是补充外部定义的 Enum 结构。

```typescript
enum Foo {
  A,
}
enum Foo {
  B = 1,
}
enum Foo {
  C = 2,
}
// 等同于
enum Foo {
  A, // Enum 结构合并时，只允许其中一个的首成员省略初始值，否则报错。
  B = 1，
  C = 2
}
```

## 常数 Enum

​        常数枚举是使用 const enum 定义的枚举类型。常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

```typescript
const enum Directions {
    Up,
    Down,
    Left,
    Right
}
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

## 字符串 Enum

​        有些场合，开发者可能希望Enum成员值可以保存一些有用信息，所以TS才设计了字符串Enum。枚举(Enum)类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

​        Enum成员的值除了设为数值，还可以设为字符串。也就是说，Enum也可以用作一组相关字符串的集合。注意，字符串枚举的所有成员值，都必须显式设置。如果没有设置，成员值默认为数值，且位置必须在字符串成员之前。Enum 成员可以是字符串和数值混合赋值。除了数值和字符串，Enum 成员不允许使用其他值（比如 Symbol 值）。

```typescript
enum Enum {
  One = 'One',
  Two = 'Two',
  Three = 3,
  Four = 4,
}
```

​        变量类型如果是字符串 Enum，就不能再赋值为字符串，这跟数值 Enum 不一样。由于这个原因，如果函数的参数类型是字符串 Enum，传参时就不能直接传入字符串，而要传入 Enum 成员。因此，字符串 Enum 作为一种类型，有限定函数参数的作用。

​        字符串 Enum 可以使用联合类型代替。字符串 Enum 的成员值，不能使用表达式赋值。

```typescript
function move(
  where:'Up'|'Down'|'Left'|'Right' // 函数参数where属于联合类型，效果跟指定为字符串Enum一样
) {
  // ...
 }
enum MyEnum {
  A = 'one',
  B = ['T', 'w', 'o'].join('') // 报错。成员B的值是一个字符串表达式，导致报错
}
```

## 外部枚举 Enum

​        外部枚举（Ambient Enums）是使用 declare enum 定义的枚举类型。declare 定义的类型只会用于编译时的检查，编译结果中会被删除。

```typescript
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

> 外部枚举与声明语句一样，常出现在声明文件中。
> 同时使用 declare 和 const 也是可以的。

## keyof 运算符

​         keyof 运算符可以取出 Enum 结构的所有成员名，作 为联合类型返回。

```typescript
enum MyEnum {
  A = 'a',
  B = 'b'
}
// 'A'|'B'
type Foo = keyof typeof MyEnum; // 类型Foo等同于联合类型'A'|'B'
// 注意，这里的typeof是必需的，否则keyof MyEnum相当于keyof string
type Foo = keyof MyEnum; // number | typeof Symbol.iterator | "toString" | "charAt" | "charCodeAt" | ...
```

>  Enum 作为类型，本质上属于number或string的一种变体，而typeof MyEnum会将MyEnum当作一个值处理，从而先其转为对象类型，就可以再用keyof运算符返回该对象的所有属性名。

​        如果要返回 Enum 所有的成员值，可以使用in运算符。

```typescript
enum MyEnum {
  A = 'a',
  B = 'b'
}
// 采用属性索引可以取出MyEnum的所有成员值
type Foo = { [key in MyEnum]: any }; // { a: any, b: any }
```

## 反向映射

​        数值Enum存在反向映射，即可以通过成员值获得成员名。注意，这种情况只发生在数值Enum，对于字符串Enum，不存在反向映射。这是因为字符串Enum编译后只有一组赋值。

## namespace

​        namespace 是一种将相关代码组织在一起的方式，中文译为“命名空间”。自从有了 ES 模块，官方已经不推荐使用 namespace 了。

## 基本用法

​        namespace 用来建立一个容器，内部的所有变量和函数，都必须在这个容器里面使用。

​        如果要在命名空间以外使用内部成员，就必须为该成员加上export前缀，表示对外输出该成员。

​        namespace 内部还可以使用import命令输入外部成员，相当于为外部成员起别名。当外部成员的名字比较长时，别名能够简化代码。import命令也可以在 namespace 外部指定别名。

​        使用嵌套的命名空间，必须从最外层开始引用。

​        namespace不仅可以包含实义代码，还可以包括类型代码。

​        namespace 与模块的作用是一致的，都是把相关代码组织在一起，对外输出接口。区别是一个文件只能有一个模块，但可以有多个 namespace。由于模块可以取代 namespace，而且是 JavaScript 的标准语法，还不需要编译转换，所以建议总是使用模块替代 namespace。

​        如果 namespace 代码放在一个单独的文件里，那么引入这个文件需要使用三斜杠的语法。

```typescript
/// <reference path = "SomeFileName.ts" />
```

## namespace 的输出

​        namespace 本身也可以使用export命令输出，供其他文件使用。

```typescript
// shapes.ts
export namespace Shapes { // 输出了一个命名空间Shapes
  export class Triangle {
    // ...
  }
  export class Square {
    // ...
  }
}
```

​        其他脚本文件使用import命令加载这个命名空间。

```typescript
// 写法一
import { Shapes } from './shapes';
let t = new Shapes.Triangle();
// 写法二
import * as shapes from "./shapes";
let t = new shapes.Shapes.Triangle();
```

​        不过，更好的方法还是建议使用模块，采用模块的输出和输入。

```typescript
// shapes.ts
export class Triangle {
  /* ... */
}
export class Square {
  /* ... */
}
// shapeConsumer.ts
import * as shapes from "./shapes";
let t = new shapes.Triangle();
```

## namespace 的合并

​        多个同名的namespace会自动合并，这一点跟interface一样。如果同名的命名空间分布在不同的文件中，TypeScript最终会将它们合并在一起。这样就比较方便扩展别人的代码。

​        合并命名空间时，命名空间中非export的成员不会被合并，但它们只能在各自的命名空间中使用。

​        命名空间还可以跟同名函数合并，但是要求同名函数必须在命名空间之前声明。这样做是为了确保先创建出一个函数对象，然后同名的命名空间就相当于给这个函数对象添加额外的属性。

​        命名空间也能与同名 class 合并，同样要求class 必须在命名空间之前声明，原因同上。

​        命名空间还能与同名 Enum 合并。注意，Enum成员与命名空间导出成员不允许同名。

## 模块

​        任何包含 import 或 export 语句的文件，就是一个模块。相应地，如果文件不包含 export 语句，就是一个全局的脚本文件。

​       模块本身就是一个作用域，不属于全局作用域。模块内部的变量、函数、类只在内部可见，对于模块外部是不可见的。暴露给外部的接口，必须用 export 命令声明；如果其他文件要使用模块的接口，必须用 import 命令来输入。

​       如果一个文件不包含export语句，但是希望把它当作一个模块(即内部变量对外不可见)，可以在脚本头部添加一行语句。

```typescript
export {}; //这行语句不产生任何实际作用，但会让当前文件被当作模块处理，所有它的代码都变成了内部代码
```

​        TypeScript模块除了支持所有ES模块的语法，特别之处在于允许输出和输入类型。

​        TypeScript 允许加载模块时，省略模块文件的后缀名，它会自动定位。

​        编译时，可以两个脚本同时编译。

## import type 语句

​        import 在一条语句中，可以同时输入类型和正常接口。这样很不利于区分类型和正常接口，容易造成混淆。为了解决这个问题，TypeScript 引入了两个解决方法。

```typescript
// 第一个方法是在 import 语句输入的类型前面加上type关键字。
import { type A, a } from './a';
// 第二个方法是使用 import type 语句，这个语句只用来输入类型，不用来输入正常接口。
import type { A } from './a'; // 输入类型A是正确的，可以把A当作类型使用
let b:A = 'hello'; // 正确
import type { a } from './a'; // 输入正常接口a，并把a当作一个值使用，就会报错
let b = a; // 报错
```

​        import type 语句也可以输入默认类型。

```typescript
import type DefaultType from 'moduleA';
import type * as TypeNS from 'moduleA'; // 在一个名称空间下，输入所有类型的写法如下
```

​        同样的，export 语句也有两种方法，表示输出的是类型。

```typescript
type A = 'a';
type B = 'b';
// 方法一 使用type关键字作为前缀
export {type A, type B};
// 方法二 使用 export type 语句，表示整行输出的都是类型
export type {A, B};
```

## importsNotUsedAsValues 编译设置

​        TypeScript 提供了importsNotUsedAsValues编译设置项，有三个可能的值。

- remove：这是默认值，自动删除输入类型的 import 语句。
- preserve：保留输入类型的 import 语句。
- error：保留输入类型的 import 语句(与preserve相同)，但必须写成import type形式，否则报错。

## CommonJS 模块

​        CommonJS 是 Node.js 的专用模块格式，与 ES 模块格式不兼容。

### import = 语句

​        使用import =语句输入 CommonJS 模块。

```typescript
import * as fs from 'fs'; // 允许用import * as [接口名] from "模块文件"输入CommonJS模块
// 等同于
import fs = require('fs'); // 用import =语句和require()命令输入了一个CommonJS模块
```

### export = 语句

​        使用export =语句输出 CommonJS 模块的对象，等同于 CommonJS 的module.exports对象。

​        export =语句输出的对象，只能使用import =语句加载。

```typescript
let obj = { foo: 123 };
export = obj;
import obj = require('./a');
console.log(obj.foo); // 123
```

## 模块定位

​        模块定位指的是一种算法，用来确定 import 语句和 export 语句里面的模块文件位置。

```typescript
// 相对模块
import { TypeA } from './a';
// 非相对模块
import * as $ from "jquery";
```

​        编译参数moduleResolution，用来指定具体使用哪一种定位算法。常用的算法有两种：Classic和Node。如果没有指定moduleResolution，默认值与编译参数module有关。module设为commonjs时，moduleResolution的默认值为Node，即采用 Node.js 的模块定位算法。其他情况下（module设为 es2015、 esnext、amd, system, umd 等等），就采用Classic定位算法。

### 相对模块，非相对模块

​        相对模块指的是路径以/、./、../开头的模块。相对模块的定位，是根据当前脚本的位置进行计算的，一般用于保存在当前项目目录结构中的模块脚本。

​       非相对模块指的是不带有路径信息的模块。非相对模块的定位，是由baseUrl属性或模块映射而确定的，通常用于加载外部模块。

### Classic 方法

​        Classic 方法以当前脚本的路径作为“基准路径”，计算相对模块的位置。

​        至于非相对模块，也是以当前脚本的路径作为起点，一层层查找上级目录。

### Node 方法

​        Node 方法就是模拟 Node.js 的模块加载方法，也就是require()的实现方法。

​        相对模块依然是以当前脚本的路径作为“基准路径”。

​        非相对模块则是以当前脚本的路径作为起点，逐级向上层目录查找是否存在子目录node_modules。

### 路径映射

​        TypeScript 允许开发者在tsconfig.json文件里面，手动指定脚本模块的路径。

- baseUrl：可以手动指定脚本模块的基准目录。
- paths：指定非相对路径的模块与实际脚本的映射。
- rootDirs：指定模块定位时必须查找的其他目录。

### tsc 的--traceResolution参数

​        能够在编译时在命令行显示模块定位的每一步。

```bash
tsc --traceResolution // 会输出模块定位的判断过程
```

### tsc 的--noResolve参数

​        表示模块定位时，只考虑在命令行传入的模块。

```typescript
import * as A from "moduleA";
import * as B from "moduleB";
# 可以定位到moduleA.ts，因为它从命令行传入了,无法定位到moduleB，因为它没有传入，因此会报错
tsc app.ts moduleA.ts --noResolve 
```