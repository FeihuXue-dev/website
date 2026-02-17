## Personal Website

这是一个以个人主页为核心的静态网站仓库，包含：

- Material 风格主页（卡片化布局）
- 武汉实时天气与时间展示
- 随机哲理语句在线拉取
- Academic Pages 模板简历跳转
- 学术主页模板（`my-academic-cv`）与生成简历文件

---

## 项目结构

```text
website/
├─ index.html                         # 主页
├─ style.css                          # 主页样式
├─ script.js                          # 时间/天气/语录逻辑
├─ resumes.html                       # 旧版简历入口页（当前主页不再使用）
├─ pictures/                          # 站点图片资源（含背景图）
├─ my-academic-cv/                    # 学术简历网站模板
│  └─ generated-resumes/              # 已生成的中英文简历
│     ├─ phd-zh.md
│     ├─ phd-en.md
│     ├─ job-intern-zh.md
│     └─ job-intern-en.md
└─ crack-segmentation-website/        # 裂缝分割研究展示站点导出文件
```

---

## 主要页面

- 主页：`index.html`
- 模板简历页（外链）：`https://feihuxue-dev.github.io/my-academic-cv/cv/`
- 学术版简历（中文）：`my-academic-cv/generated-resumes/phd-zh.md`
- 学术版简历（英文）：`my-academic-cv/generated-resumes/phd-en.md`
- 求职/实习简历（中文）：`my-academic-cv/generated-resumes/job-intern-zh.md`
- 求职/实习简历（英文）：`my-academic-cv/generated-resumes/job-intern-en.md`

---

## 本地预览

直接双击 `index.html` 可查看基础页面。

更推荐使用本地静态服务器（避免部分浏览器对本地资源/API 的限制）：

```bash
# 任选其一
python -m http.server 8080
npx serve .
```

然后访问：

- `http://localhost:8080/index.html`
- `http://localhost:8080/resumes.html`

---

## 部署（Cloudflare Pages）

1. 将仓库推送到 GitHub
2. 在 Cloudflare Pages 选择 `Connect to Git`
3. 构建设置：
   - Framework preset: `None`
   - Build command: 留空
   - Build output directory: `.`
4. 部署完成后，用分配的 `*.pages.dev` 域名访问

---

## 数据与接口说明

- 天气数据：Open-Meteo（武汉坐标）
- 语录数据：Hitokoto
- 脚本中包含失败回退逻辑（直连失败时走代理）

---

## 后续建议

- 将 `generated-resumes/*.md` 再输出为样式化 `*.html`，便于投递与分享
- 补全简历中的占位字段（学校、学位、论文、奖项）
- 添加多语言切换入口（中文/英文）
