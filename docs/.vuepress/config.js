module.exports = {
  // 配置网站的标题和描述，方便 SEO
  title: "Vivien's Notebook",
  description: "Vivien个人博客",
  logo: '/avator.jpg',
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
  theme: "reco", // 主题配置
  themeConfig: {
    type: "blog", // 主题模式 博客模式
    logo: '/logo.jpg',// 注意图片放在 public 文件夹下
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
      // 嵌套 Group - 最大深度为 2
      {
        text: "读书笔记",
        icon: "reco-document",
        items: [
          {
            text: "深入浅出webpack",
            link: "/books/webpack/webpack",
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
      "/books/": [
        {
          title: "Vue3学习笔记",
          collapsable: true,
          children: [{ title: "Vue3学习笔记", path: "/books/Vue/Vue3学习笔记" }],
        },
        {
          title: "Vue3学习笔记",
          collapsable: true,
          children: [{ title: "Vue3学习笔记", path: "/books/Vue/Vue3学习笔记" }],
        },
      ],
    },

    // 评论插件配置
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
    ],
  },
};
