module.exports = {
  // 配置网站的标题和描述，方便 SEO
  title: "Vivien's Notebook",
  description: "Vivien个人博客",
  logo: "/avator.jpg",
  locales: {
    // 语言配置
    "/": {
      lang: "zh-CN",
    },
  },
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  base: "/vivien-blog/", // 路径配置
  head: [
    ["link", { rel: "icon", href: "/logo.jpg" }], // 引入icon图标
  ],
  theme: "reco", // 主题配置
  themeConfig: {
    type: "blog", // 主题模式 博客模式
    logo: "/logo.jpg", // 注意图片放在 public 文件夹下
    autohor: "Vivien",
    authorAvatar: "/avator.jpg", // 个人信息的头像
    search: true, // 内置搜索
    searchMaxSuggestions: 10,
    lastUpdated: "上次更新", // 显示最后更新时间 string | boolean
    timezoneOffset: 8 * 60 * 60 * 1000, // 设置时区偏移量（8小时） // 博客配置
    blogConfig: {
      socialLinks: [
        { icon: "reco-github", link: "https://github.com/yoguoer" },
      ],
    },
    // 评论插件配置（留言板）
    valineConfig: {
      appId: "eaXIQJQNeU73qI8Vnal6YUUq-gzGzoHsz",
      appKey: "RBxwZ8cC5WMckHnFh9JdXWUo",
      showComment: false, // isShowComments: true  在需要添加评论的页面加上这个配置
    },
    subSidebar: "auto", // 生成子侧边栏

    // 导航栏配置
    nav: [
      {
        text: "笔记",
        icon: "reco-blog",
        items: [
          {
            text: "学习笔记",
            items: [
              {
                text: "Vue3学习笔记",
                link: "/note/Vue3学习笔记/Vue3与Vue2对比/",
              },
              {
                text: "VueCLI学习笔记",
                link: "/note/学习笔记/VueCLI学习笔记/",
              }
            ]
          },
          {
            text: "踩坑笔记",
            items: [
              // {
              //   text: "深入浅出webpack",
              //   link: "/books/webpack/webpack/",
              // }
            ]
          },
        ],
      },
      {
        text: "书籍",
        icon: "reco-document",
        items: [
          {
            text: "深入浅出webpack",
            link: "/books/深入浅出webpack/为什么要使用webpack/",
          },
          {
            text: "ES6入门教程",
            link: "/books/ES6入门教程/ES6与JavaScript/",
          },
          {
            text: "TypeScript教程",
            link: "/books/TypeScript教程/简介和基本用法/",
          },
        ],
      },
      { text: "TimeLine", link: "/timeline/", icon: "reco-date" },
      { text: "留言板", link: "/messageBoard/messageBoard", icon: "reco-tag" },
      {
        text: "contact Vivien",
        items: [
          { text: "Github", link: "https://github.com/yoguoer" },
          { text: "CSDN", link: "https://blog.csdn.net/Vivien_CC" },
        ],
      },
    ],

    // 侧边栏配置
    sidebar: {
      "/messageBoard/": [
        {
          title: "messageBoard",
          path: "/messageBoard/messageBoard",
        },
      ],
      "/books/": [
        {
          title: "深入浅出webpack",
          collapsable: true,
          sidebarDepth: 2, // 缩放子级别名称
          children: [
            {
              title: "为什么要使用webpack",
              path: "/books/深入浅出webpack/为什么要使用webpack",
            },
            {
              title: "webpack的使用",
              path: "/books/深入浅出webpack/webpack的使用",
            },
            {
              title: "手动使用webpack",
              path: "/books/深入浅出webpack/手动使用webpack",
            },
            {
              title: "更深入的一些知识",
              path: "/books/深入浅出webpack/更深入的一些知识",
            },
          ],
        },
        {
          title: "ES6入门教程",
          collapsable: true, // 是否折叠
          sidebarDepth: 2, // 缩放子级别名称
          children: [
            {
              title: "ES6与JavaScript",
              path: "/books/ES6入门教程/ES6与JavaScript",
            },
            {
              title: "let和const命令",
              path: "/books/ES6入门教程/let和const命令",
            },
            {
              title: "变量的解构赋值",
              path: "/books/ES6入门教程/变量的解构赋值",
            },
            {
              title: "字符串的扩展",
              path: "/books/ES6入门教程/字符串的扩展",
            },
            {
              title: "字符串的新增方法",
              path: "/books/ES6入门教程/字符串的新增方法",
            },
            {
              title: "正则的扩展",
              path: "/books/ES6入门教程/正则的扩展",
            },
            {
              title: "数值的扩展",
              path: "/books/ES6入门教程/数值的扩展",
            },
            {
              title: "函数的扩展",
              path: "/books/ES6入门教程/函数的扩展",
            },
            {
              title: "数组的扩展",
              path: "/books/ES6入门教程/数组的扩展",
            },
            {
              title: "对象的扩展",
              path: "/books/ES6入门教程/对象的扩展",
            },
            {
              title: "对象的新增方法",
              path: "/books/ES6入门教程/对象的新增方法",
            },
            {
              title: "Symbol",
              path: "/books/ES6入门教程/Symbol",
            },
            {
              title: "Set和Map数据结构",
              path: "/books/ES6入门教程/Set和Map数据结构",
            },
            {
              title: "Proxy",
              path: "/books/ES6入门教程/Proxy",
            },
            {
              title: "Promise对象",
              path: "/books/ES6入门教程/Promise对象",
            },
            {
              title: "Iterator和for...of循环",
              path: "/books/ES6入门教程/Iterator和for...of循环",
            },
            {
              title: "Generator函数的语法和异步调用",
              path: "/books/ES6入门教程/Generator函数的语法和异步调用",
            },
            {
              title: "async函数",
              path: "/books/ES6入门教程/async函数",
            },
            {
              title: "Class的基本语法和继承",
              path: "/books/ES6入门教程/Class的基本语法和继承",
            },
            {
              title: "Module的语法和加载实现",
              path: "/books/ES6入门教程/Module的语法和加载实现",
            },
            {
              title: "编程风格",
              path: "/books/ES6入门教程/编程风格",
            },
            {
              title: "异步遍历器",
              path: "/books/ES6入门教程/异步遍历器",
            },
            {
              title: "ArrayBuffer",
              path: "/books/ES6入门教程/ArrayBuffer",
            },
            {
              title: "最新提案",
              path: "/books/ES6入门教程/最新提案",
            },
            {
              title: "Decorator和Mixin",
              path: "/books/ES6入门教程/Decorator和Mixin",
            },
            {
              title: "函数式编程",
              path: "/books/ES6入门教程/函数式编程",
            },
          ],
        },
        {
          title: "TypeScript教程",
          collapsable: true,
          sidebarDepth: 2, // 缩放子级别名称
          children: [
            {
              title: "简介和基本用法",
              path: "/books/TypeScript教程/简介和基本用法",
            },
            {
              title: "类型系统",
              path: "/books/TypeScript教程/类型系统",
            },
            {
              title: "数组和元组",
              path: "/books/TypeScript教程/数组和元组",
            },
            {
              title: "symbol类型和对象",
              path: "/books/TypeScript教程/symbol类型和对象",
            },
            {
              title: "函数",
              path: "/books/TypeScript教程/函数",
            },
            {
              title: "interface和类",
              path: "/books/TypeScript教程/interface和类",
            },
            {
              title: "泛型和类型断言",
              path: "/books/TypeScript教程/泛型和类型断言",
            },
            {
              title: "Enum、namespace和模块",
              path: "/books/TypeScript教程/Enum、namespace和模块",
            },
            {
              title: "装饰器",
              path: "/books/TypeScript教程/装饰器",
            },
            {
              title: "declare关键字",
              path: "/books/TypeScript教程/declare关键字",
            },
            {
              title: "类型运算符和类型映射",
              path: "/books/TypeScript教程/类型运算符和类型映射",
            },
            {
              title: "其它",
              path: "/books/TypeScript教程/其它",
            },
          ],
        },
      ],
      "/note/": [
        {
          title: "Vue3学习笔记",
          collapsable: true,
          sidebarDepth: 2, // 缩放子级别名称
          children: [
            {
              title: "Vue3与Vue2对比",
              path: "/note/Vue3学习笔记/Vue3与Vue2对比",
            },
            {
              title: "创建Vue3项目",
              path: "/note/Vue3学习笔记/创建Vue3项目",
            },
            {
              title: "Composition API",
              path: "/note/Vue3学习笔记/CompositionAPI",
            },
            {
              title: "新的组件",
              path: "/note/Vue3学习笔记/新的组件",
            },
            {
              title: "其它新的 API",
              path: "/note/Vue3学习笔记/其它新的API",
            },
          ],
        },
        {
          title: "学习笔记",
          collapsable: true,
          sidebarDepth: 2, // 缩放子级别名称
          children: [
            {
              title: "VueCLI学习笔记",
              path: "/note/学习笔记/VueCLI学习笔记",
            },
          ]
        },
      ]
    },

    // 插件
    plugins: [
      ["@vuepress-reco/vuepress-plugin-back-to-top"], // 回到顶部小火箭插件
      [
        "@vuepress-reco/vuepress-plugin-pagation", // 分页插件，实现首页内容分页展示效果
        {
          perPage: 5, // 每页展示条数
        },
      ],
      [
        "@vuepress/pwa", // 内容刷新弹窗插件。网站有内容更新时会出现弹窗，并提供刷新按钮方便用户查看网站最新内容。
        {
          serviceWorker: true,
          updatePopup: {
            message: "有新的内容更新",
            buttonText: "刷新",
          },
        },
      ],
      [
        "vuepress-plugin-nuggets-style-copy", // 代码复制弹窗插件，提升复制代码体验。
        {
          copyText: "copy",
          tip: {
            content: "复制成功!",
          },
        },
      ],
      // // 评论插件配置（文章底部）
      // [
      //   "@vssue/vuepress-plugin-vssue",
      //   {
      //     platform: "github", //v3的platform是github，v4的是github-v4
      //     locale: "zh", //语言
      //     // 其他的 Vssue 配置
      //     owner: "yoguoer", //github账户名
      //     repo: "vivien-blog", //github一个项目的名称
      //     clientId: "e4d9f627fcda10151da0", //注册的Client ID
      //     clientSecret: "8dd6e4718305c68d64eadf159a511e5b8e31652f", //注册的Client Secret
      //     autoCreateIssue: true, // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
      //   },
      // ],
    ],
  },
};
