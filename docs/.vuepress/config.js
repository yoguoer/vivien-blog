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
    sidebarDepth: 2,
    smoothScroll: true,
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
    nav: require('./configs/nav'), // 导航栏配置
    sidebar: require('./configs/sidebar'), // 侧边栏配置
    markdown: {
      extendMarkdown: md => {
        md.use(require("markdown-it-disable-url-encode"));
      },
      toc: {
        includeLevel: [1, 2, 3, 4] // includeLevel 默认值为[2, 3], 所以默认不显示一级标题
      }
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
      ["vuepress-plugin-reading-time"], // 阅读时长
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
      ['vuepress-plugin-code-copy', true],
      [
      "vuepress-plugin-nuggets-style-copy",
      {
        copyText: "复制代码",
        tip: {
          content: "复制成功",
        },
      },
      ],
    ],
  },
};
