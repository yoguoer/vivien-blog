---
title: declare关键字
author: vivien
date: '2024-04-08'
# headerImage: /about-bg.jpg # public 文件夹下的图片
isShowComments: true    # 展示评论
categories:     # 分类
 - Books
tags:       # 标签
 - TypeScript
---

## 简介

​        declare 关键字用来告诉编译器，某个类型是存在的，可以在当前文件中使用。它的主要作用，就是让当前文件可以使用其他文件声明的类型。这样，编译单个脚本就不会因为使用了外部类型而报错。

​        它只是通知编译器某个类型是存在的，不用给出具体实现。只能用来描述已经存在的变量和数据结构，不能用来声明新的变量和数据结构，另外，所有declare语句都不会出现在编译后的文件里面。

## 参数

- declare variable：给出外部变量的类型描述。（声明全局变量）
- declare function：给出外部函数的类型描述。（声明全局方法）
- declare class：给出 class 类型描述。（声明全局类）
- declare module，declare namespace：把变量、函数、类组织在一起。
- declare global：为 JavaScript 引擎的原生对象添加属性和方法。
- declare enum：给出 enum 类型描述。（声明全局枚举类型）
- declare module 用于类型声明文件：可以为每个模块脚本，定义一个.d.ts文件，把该脚本用到的类型定义都放在这个文件里面。但是，更方便的做法是为整个项目，定义一个大的.d.ts文件，在这个文件里面使用declare module定义每个模块脚本的类型。

## d.ts 类型声明文件

## 简介

​        当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

> ● declare var： 声明全局变量
> ● declare function： 声明全局方法
> ● declare class： 声明全局类
> ● declare enum： 声明全局枚举类型
> ● declare namespace： 声明（含有子属性的）全局对象
> ● interface 和 type： 声明全局类型
> ● export： 导出变量
> ● export namespace： 导出（含有子属性的）对象
> ● export default ES6： 默认导出
> ● export = commonjs： 导出模块
> ● export as namespace： UMD 库声明全局变量
> ● declare global： 扩展全局变量
> ● declare module： 扩展模块
> ● /// <reference />： 三斜线指令

​        单独使用的模块，一般会同时提供一个单独的类型声明文件，把本模块的外部接口的所有类型都写在这个文件里面，便于模块使用者了解接口，也便于编译器检查使用者的用法是否正确。通常我们会把声明语句放到一个单独的文件。

​       类型声明文件里面只有类型代码，没有具体的代码实现。它的文件名一般为[模块名].d.ts的形式，其中的d表示 declaration（声明）。

```typescript
// 模块输出
module.exports = 3.142;// 整体导出
exports.bar = bar; // 单个导出
// 类型输出
// 写法一
declare const pi: number;
export default pi; // 模块输出在类型声明文件中，也可以使用export default表示
// 写法二
declare const pi: number;
export= pi; // 使用export =
//针对这种模块导出，有多种方式可以导入
// 写法一 const ... = require
const foo = require('foo'); // 整体导入
const bar = require('foo').bar; // 单个导入
// 写法二 import ... from
import * as foo from 'foo'; // 整体导入
import { bar } from 'foo'; // 单个导入
// 写法三 import ... require   ts 官方推荐的方式
import foo = require('foo'); // 整体导入
import bar = require('foo').bar; // 单个导入
```

## 类型声明文件的来源

### 自动生成

​        如果库的源码本身就是由 ts 写的，那么在使用 tsc 脚本将 ts 编译为 js 的时候，添加 declaration 选项，编译器就会在编译时自动生成单独的类型声明文件（ .d.ts 声明文件）。

```typescript
{
  "compilerOptions": {
    "declaration": true
  }
}
```

​        也可以在命令行打开这个选项。

```bash
tsc --declaration
```

### 内置声明文件

​        安装TypeScript语言时，会同时安装一些内置的类型声明文件，主要是内置的全局对象(JavaScript语言接口和运行环境API)的类型声明。这些内置声明文件位于TypeScript语言安装目录的lib文件夹内。

### 外部类型声明文件

​        外部模块的类型声明文件，需要自己安装。如果项目中使用了外部的某个第三方代码库，那么就需要这个库的类型声明文件。这时又分成三种情况。

- 这个库自带了类型声明文件。一般来说，如果这个库的源码包含了[vendor].d.ts文件，那么就自带了类型声明文件，使用这个库可能需要单独加载它的类型声明文件。
- 这个库没有自带，但是可以找到社区制作的类型声明文件。第三方库如果没有提供类型声明文件，社区往往会提供，TS社区主要使用 DefinitelyTyped 仓库，各种类型声明文件都会提交到那里，已经包含了几千个第三方库，这些声明文件都会作为一个单独的库，使用时安装这个库就可以了。
- 找不到类型声明文件，需要自己写。有时实在没有第三方库的类型声明文件，又很难完整给出该库的类型描述，这时可以告诉 TypeScript 相关对象的类型是any。

## declare 关键字

​        类型声明文件只包含类型描述，不包含具体实现，所以非常适合使用 declare 语句来描述类型。

​        类型声明文件里面，变量的类型描述必须使用declare命令，否则会报错，因为变量声明语句是值相关代码。

​        interface 类型有没有declare都可以，因为 interface 是完全的类型代码。

​        类型声明文件里面，顶层可以使用export命令，也可以不用，除非使用者脚本会显式使用export命令输入类型。

## 模块发布

​        当前模块如果包含自己的类型声明文件，可以在package.json文件里面添加一个types字段或typings字段，指明类型声明文件的位置。

​        如果类型声明文件名为index.d.ts，且在项目的根目录中，就不需要在package.json里面注明了。

​        当我们为一个库写好了声明文件之后，下一步就是将它发布出去了。此时有两种方案：

- ① 将声明文件和源码放在一起(优先)。保持声明文件与源码在一起，使用时就不需要额外增加单独的声明文件库的依赖了，而且也能保证声明文件的版本与源码的版本保持一致。
- ②将声明文件发布到@types下。仅当我们在给别人的仓库添加类型声明文件，但原作者不愿意合并 pull request 时，才需要使用第二种方案，将声明文件发布到 @types 下。

## 三斜杠命令

​        如果类型声明文件的内容非常多，可以拆分成多个文件，然后入口文件使用三斜杠命令，加载其他拆分后的文件。除了拆分类型声明文件，三斜杠命令也可以用于普通脚本加载类型声明文件。

​        三斜杠命令(///)是一个TypeScript编译器命令，用来指定编译器行为。只能用在文件的头部，如果用在其他地方，会被当作普通的注释。另外，若一个文件中使用了三斜线命令，那么在三斜线命令之前只允许使用单行注释、多行注释和其他三斜线命令，否则三斜杠命令也会被当作普通的注释。

### /// <reference path="" />

​       最常见的三斜杠命令，告诉编译器在编译时需要包括的文件，常用来声明当前脚本依赖的类型文件。

​       编译器会在预处理阶段，找出所有三斜杠引用的文件，将其添加到编译列表中，然后一起编译。

​      path参数指定了所引入文件的路径。如果该路径是一个相对路径，则基于当前脚本的路径进行计算。

​      使用该命令时，有以下两个注意事项。

- path参数必须指向一个存在的文件，若文件不存在会报错。
- path参数不允许指向当前文件。

> 默认情况下，每个三斜杠命令引入的脚本，都会编译成单独的JS文件。如果希望编译后只产出一个合并文件，可以使用编译选项outFile。但是，outFile编译选项不支持合并CommonJS模块和ES模块，只有当编译参数module的值设为 None、System 或 AMD 时，才能编译成一个文件。
> 如果打开了编译参数noResolve，则忽略三斜杠指令。将其当作一般的注释，原样保留在编译产物中。

### /// <reference types="" />

​      用来告诉编译器当前脚本依赖某个DefinitelyTyped类型库，通常安装在node_modules/@types目录。types 参数的值是类型库的名称，也就是安装到node_modules/@types目录中的子目录的名字。

​      这个命令的作用类似于import命令。

​      注意，这个命令只在自己手写类型声明文件(.d.ts文件)时，才有必要用到，就是说，只应该用在.d.ts文件中，普通的.ts脚本文件不需要写这个命令。如果是普通的.ts脚本，可以使用tsconfig.json文件的types属性指定依赖的类型库。

### /// <reference lib="" />

​        允许脚本文件显式包含内置 lib 库，等同于在tsconfig.json文件里面使用lib属性指定 lib 库。

​        安装TypeScript软件包时，会同时安装一些内置的类型声明文件，即内置的lib库。这些库文件位于TypeScript安装目录的lib文件夹中，它们描述了JavaScript语言和引擎的标准 API。

> 库文件并不是固定的，会随着TS版本的升级而更新。库文件统一使用“lib.[description].d.ts”的命名方式，而/// <reference lib="" />里面的lib属性的值就是库文件名的description部分，比如lib="es2015"就表示加载库文件lib.es2015.d.ts。