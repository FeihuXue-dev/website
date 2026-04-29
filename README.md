# Personal Homepage Website

一个 Material 风格的个人主页，采用卡片式布局整合多种动态模块，支持深色模式切换。

## ✨ 特性

- 🌤️ 武汉实时天气（Open-Meteo API）
- 🕐 实时时钟（Asia/Shanghai 时区）
- 💬 随机哲理语句（Hitokoto API）
- 🌙 深色/浅色模式切换（本地存储偏好）
- 📊 技术栈技能展示（带动画进度条）
- 🚀 精选项目展示
- ✨ 页面加载动画 + 卡片入场效果
- 🔮 背景浮动光效装饰
- ⬆️ 返回顶部按钮
- 📱 全面响应式布局（4 个断点：1080px / 900px / 700px / 420px）
- 👆 触摸设备优化

无需构建工具，直接托管即可上线（推荐 Cloudflare Pages）。

## 摄影作品自动同步

网站支持从本机摄影目录随机选取 1 张图片发布到摄影分享页，避免把完整摄影库上传到 GitHub。

### 手动同步一次

```powershell
node scripts/sync-photography.mjs --source "G:\Lumix_Photo" --site "I:\Crack_Detection\My_model\website"
```

同步后会生成或更新：

- `pictures/photography/daily-photo.jpg`：今日随机摄影图片
- `photography-manifest.js`：主页摄影入口与摄影页使用的单图清单

### 注册每天自动同步

```powershell
powershell -ExecutionPolicy Bypass -File scripts/register-photography-sync.ps1
```

默认任务名为 `WebsitePhotographySync`，每天 03:00 扫描 `G:\Lumix_Photo`。如需修改时间：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/register-photography-sync.ps1 -At "22:30"
```

如果需要计划任务每天同步后自动提交并推送到 GitHub，使用：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/register-photography-sync.ps1 -CommitAndPush
```

## 技术栈

- HTML5: `index.html`
- CSS3: `style.css` (CSS Variables, Grid, Animations, Media Queries)
- Vanilla JavaScript: `script.js` (ES6+)
- 图标: Font Awesome CDN
- 字体: Google Fonts（Roboto / Noto Sans SC / Orbitron）

## 目录结构

```text
website/
├─ index.html
├─ style.css
├─ script.js
├─ README.md
├─ pictures/
│  ├─ 武汉大学大暑.jpg
│  ├─ 小猫.jpg
│  └─ 哆啦A梦裂缝分割logo-modified.png
└─ crack-segmentation-website/   # 历史导出内容（可选）
```

## 本地预览

直接双击 `index.html` 即可预览。

如果你希望更接近线上环境，建议使用本地静态服务器：

```bash
# Python 3
python -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 部署（Cloudflare Pages）

1. 将仓库推送到 GitHub。
2. 在 Cloudflare Dashboard 打开 `Workers & Pages` -> `Create` -> `Pages`。
3. 连接 Git 仓库并选择分支（如 `main`）。
4. 构建设置：
   - Framework preset: `None`
   - Build command: 留空
   - Build output directory: `.`（或 `/`）
5. 点击部署。

部署完成后会生成 `*.pages.dev` 域名，可继续绑定自定义域名。

## 动态数据说明

### 1) 天气（武汉）

- 数据源：Open-Meteo
- 坐标：`30.5928, 114.3055`
- 刷新频率：每 10 分钟

### 2) 随机哲理语句

- 数据源：Hitokoto
- 刷新频率：每 30 分钟

### 3) 容错策略

`script.js` 中实现了“直连 + 代理回退”策略：

- 先直接请求接口
- 失败后通过 `allorigins` 代理重试

用于提升本地预览和部分网络环境下的数据可用性。

## 自定义指南

- 修改主题偏好：页面右上角月亮/太阳按钮
- 修改头像：替换 `pictures/小猫.jpg`
- 修改背景图：替换 `pictures/武汉大学大暑.jpg`
- 修改技能：编辑 `index.html` 中 skills-card 板块
- 修改项目：编辑 `index.html` 中 projects-card 板块
- 修改社交链接：编辑 `index.html` 中的导航卡片链接
- 修改配色与卡片样式：编辑 `style.css` 中 `:root` 变量

## 常见问题

1. **天气显示“暂不可用”**
   - 先检查网络是否可访问 `api.open-meteo.com`
   - 若本地文件协议受限，使用本地服务器方式预览

2. **语录不更新**
   - 检查网络是否可访问 `v1.hitokoto.cn`
   - 打开浏览器控制台查看请求错误

3. **背景图不显示**
   - 确认文件路径与文件名完全一致：`pictures/武汉大学大暑.jpg`

## License

仅用于个人主页展示与学习用途。
