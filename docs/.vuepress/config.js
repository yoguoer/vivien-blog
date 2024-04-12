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
    ["link", { rel: "icon", href: "logo.jpg" }], // 引入icon图标
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
    subSidebar: "auto", // 生成子侧边栏

    // 导航栏配置
    nav: [
      {
        text: "读书笔记",
        icon: "reco-document",
        items: [
          {
            text: "深入浅出webpack",
            link: "/books/webpack/webpack/",
          },
          {
            text: "ES6",
            link: "/books/ES6/ES6/",
          },
        ],
      },
      { text: "留言板", link: "/messageBoard/messageBoard" },
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
          path: "/messageBoard/messageBoard" 
        },
      ],
      "/books/ES6/": [
        {
          title: "ES6",
          collapsable: true, // 是否折叠
          // link: "/xxx/aa.md",
          // sidebarDepth: 2,// 缩放子级别名称
          children: [{ title: "ES6", path: "/books/ES6/ES6" }],
        },
      ],
      "/books/webpack/": [
        {
          title: "webpack",
          collapsable: true, // 是否折叠
          // link: "/xxx/aa.md",
          sidebarDepth: 2,
          children: [{ title: "webpack", path: "/books/webpack/webpack" }],
        },
      ],
    },

    // 评论插件配置（留言板）
    valineConfig: {
      appId: "zcWTwSXy2qwwag8rETtqiIZJ-gzGzoHsz",
      appKey: "DQwoEQ3tL4CUgnOSv0d9vHz8",
      showComment: false, // isShowComments: true  在需要添加评论的页面加上这个配置
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
            message: "发现新内容可用",
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
      // 评论插件配置（文章底部）
      [
        "@vssue/vuepress-plugin-vssue",
        {
          platform: "github", //v3的platform是github，v4的是github-v4
          locale: "zh", //语言
          // 其他的 Vssue 配置
          owner: "yoguoer", //github账户名
          repo: "vivien-blog", //github一个项目的名称
          clientId: "e4d9f627fcda10151da0", //注册的Client ID
          clientSecret: "8dd6e4718305c68d64eadf159a511e5b8e31652f", //注册的Client Secret
          autoCreateIssue: true, // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
        },
      ],
    ],
  },
};
