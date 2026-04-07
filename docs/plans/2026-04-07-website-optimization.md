# Website 全面优化与美化实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 对个人主页进行全面优化，包括视觉动效增强、内容板块扩充、响应式体验优化、交互体验提升和代码结构优化。

**Architecture:** 在现有 Material Design 卡片布局基础上，添加 CSS 动画系统、深色模式切换、新增技能/项目板块、粒子背景效果、加载动画、返回顶部按钮、改进移动端响应式布局，并重构 CSS 变量体系和 HTML 语义化。

**Tech Stack:** HTML5, CSS3 (CSS Variables, Animations, Grid, Flexbox), Vanilla JavaScript (ES6+), Font Awesome, Google Fonts

---

## Task 1: CSS 变量体系重构与主题系统

**Files:**
- Modify: `style.css` (entire file, focus on :root section and adding dark theme)
- Modify: `index.html` (add theme toggle button)
- Modify: `script.js` (add theme toggle logic)

**Step 1: 扩展 CSS 变量体系**

在 `style.css` 中将 `:root` 扩展为完整的 Design Token 系统：

```css
:root {
    /* === 背景 === */
    --md-bg: #eaf0ff;
    --md-bg-overlay: linear-gradient(128deg, rgba(14, 30, 64, 0.46), rgba(16, 34, 74, 0.34));
    --md-bg-image: url("./pictures/武汉大学大暑.jpg");
    --md-bg-radial: radial-gradient(1000px 600px at 90% 10%, rgba(118, 165, 255, 0.12), transparent 70%);

    /* === 表面层 === */
    --md-surface: rgba(255, 255, 255, 0.84);
    --md-surface-strong: rgba(255, 255, 255, 0.92);
    --md-surface-hover: rgba(255, 255, 255, 0.96);

    /* === 文字 === */
    --md-text: #172033;
    --md-text-inverse: #ffffff;
    --md-muted: #556079;
    --md-muted-inverse: #a0aec0;

    /* === 品牌色 === */
    --md-primary: #2f6df6;
    --md-primary-deep: #1f4fc0;
    --md-primary-light: #76a5ff;
    --md-accent: #f59e0b;

    /* === 边框 === */
    --md-line: rgba(23, 32, 51, 0.1);
    --md-line-strong: rgba(23, 32, 51, 0.18);

    /* === 阴影 === */
    --md-shadow-1: 0 6px 16px rgba(18, 29, 53, 0.14);
    --md-shadow-2: 0 18px 42px rgba(17, 35, 82, 0.22);
    --md-shadow-glow: 0 0 30px rgba(47, 109, 246, 0.15);

    /* === 圆角 === */
    --md-radius-sm: 14px;
    --md-radius-md: 22px;
    --md-radius-lg: 24px;

    /* === 间距 === */
    --md-space-xs: 8px;
    --md-space-sm: 12px;
    --md-space-md: 16px;
    --md-space-lg: 20px;
    --md-space-xl: 26px;

    /* === 过渡 === */
    --md-transition-fast: 160ms ease;
    --md-transition-base: 280ms ease;
    --md-transition-slow: 420ms ease;

    /* === 字体 === */
    --font-sans: "Roboto", "Noto Sans SC", sans-serif;
    --font-mono: "Orbitron", sans-serif;
}

/* === 深色主题 === */
[data-theme="dark"] {
    --md-bg: #0f1724;
    --md-bg-overlay: linear-gradient(128deg, rgba(0, 0, 0, 0.6), rgba(5, 10, 25, 0.5));
    --md-bg-radial: radial-gradient(1000px 600px at 90% 10%, rgba(118, 165, 255, 0.08), transparent 70%);

    --md-surface: rgba(24, 34, 56, 0.88);
    --md-surface-strong: rgba(30, 42, 68, 0.94);
    --md-surface-hover: rgba(36, 50, 80, 0.96);

    --md-text: #e2e8f0;
    --md-text-inverse: #0f1724;
    --md-muted: #94a3b8;
    --md-muted-inverse: #cbd5e1;

    --md-primary: #6b9bff;
    --md-primary-deep: #4b7de0;
    --md-primary-light: #a3c2ff;
    --md-accent: #fbbf24;

    --md-line: rgba(255, 255, 255, 0.08);
    --md-line-strong: rgba(255, 255, 255, 0.14);

    --md-shadow-1: 0 6px 16px rgba(0, 0, 0, 0.3);
    --md-shadow-2: 0 18px 42px rgba(0, 0, 0, 0.45);
    --md-shadow-glow: 0 0 30px rgba(107, 155, 255, 0.12);
}
```

**Step 2: 在 HTML 中添加主题切换按钮**

在 `index.html` 的 `<header>` 中，在"联系我"按钮前添加：

```html
<button id="themeToggle" class="theme-toggle" aria-label="切换深色模式">
    <i class="fas fa-moon"></i>
</button>
```

**Step 3: 添加主题切换按钮样式**

在 `style.css` 中添加：

```css
.theme-toggle {
    background: var(--md-surface);
    border: 1px solid var(--md-line);
    border-radius: 50%;
    width: 42px;
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--md-text);
    font-size: 1.1rem;
    transition: all var(--md-transition-fast);
    margin-right: 10px;
}

.theme-toggle:hover {
    background: var(--md-primary);
    color: #fff;
    transform: rotate(20deg);
}
```

**Step 4: 添加主题切换 JavaScript 逻辑**

在 `script.js` 顶部添加：

```javascript
// === 主题切换 ===
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon(next);
});
```

**Step 5: 更新现有样式使用 CSS 变量**

将 `style.css` 中所有硬编码颜色值替换为对应的 CSS 变量。关键替换：

```css
/* 天气卡片 */
.weather-card {
    background: linear-gradient(135deg, rgba(34, 50, 94, 0.86), rgba(20, 35, 70, 0.9));
    color: var(--md-text-inverse);
    border-color: rgba(255, 255, 255, 0.15);
}

/* 导航卡片图标 */
.nav-card i {
    color: var(--md-primary);
}

/* 底部文字 */
.footer {
    color: var(--md-muted-inverse);
}
```

**Step 6: 验证并提交**

运行本地服务器预览，确认浅色/深色切换正常，无样式断裂。

```bash
git add style.css index.html script.js
git commit -m "feat: 添加深色模式切换和完整 CSS 变量体系"
```

---

## Task 2: 页面加载动画与卡片入场效果

**Files:**
- Modify: `style.css` (添加 keyframes 和动画类)
- Modify: `index.html` (添加 loading 遮罩)
- Modify: `script.js` (添加加载完成逻辑)

**Step 1: 添加 CSS Keyframes 动画**

在 `style.css` 顶部（`:root` 之后）添加：

```css
/* === 动画关键帧 === */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.92);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

@keyframes loadingSpin {
    to { transform: rotate(360deg); }
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

**Step 2: 添加加载遮罩样式**

```css
.page-loader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--md-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.page-loader.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}

.loader-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--md-line);
    border-top-color: var(--md-primary);
    border-radius: 50%;
    animation: loadingSpin 0.8s linear infinite;
}

.loader-text {
    margin-top: 16px;
    color: var(--md-muted);
    font-size: 0.9rem;
    animation: pulse 1.5s ease-in-out infinite;
}
```

**Step 3: 在 HTML 中添加加载遮罩**

在 `<body>` 标签开头（`.page-shell` 之前）添加：

```html
<div class="page-loader" id="pageLoader">
    <div class="loader-spinner"></div>
    <p class="loader-text">加载中...</p>
</div>
```

**Step 4: 添加卡片入场动画类**

```css
.animate-in {
    opacity: 0;
    animation: fadeInUp 0.6s ease forwards;
}

.animate-in:nth-child(1) { animation-delay: 0.05s; }
.animate-in:nth-child(2) { animation-delay: 0.12s; }
.animate-in:nth-child(3) { animation-delay: 0.19s; }
.animate-in:nth-child(4) { animation-delay: 0.26s; }
.animate-in:nth-child(5) { animation-delay: 0.33s; }
.animate-in:nth-child(6) { animation-delay: 0.40s; }
.animate-in:nth-child(7) { animation-delay: 0.47s; }
```

**Step 5: 在 HTML 中为 main 下的 section 添加动画类**

将 `<main class="board">` 下的每个直接子元素添加 `animate-in` 类：

```html
<section class="material-card hero-card animate-in">
<section class="material-card weather-card animate-in">
<section class="material-card quote-card animate-in">
<a class="material-card nav-card animate-in" ...>
```

**Step 6: 添加加载完成 JS 逻辑**

在 `script.js` 底部添加：

```javascript
window.addEventListener("load", () => {
    const loader = document.getElementById("pageLoader");
    if (loader) {
        setTimeout(() => loader.classList.add("hidden"), 300);
    }
});
```

**Step 7: 提交**

```bash
git add style.css index.html script.js
git commit -m "feat: 添加页面加载动画和卡片入场效果"
```

---

## Task 3: 背景粒子/光效增强

**Files:**
- Modify: `style.css` (添加装饰性光效元素)
- Modify: `index.html` (添加装饰元素容器)

**Step 1: 添加浮动光球装饰**

在 `style.css` 中添加：

```css
/* === 装饰性光球 === */
.orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
}

.orb-1 {
    width: 400px;
    height: 400px;
    background: var(--md-primary);
    top: -100px;
    right: -100px;
    animation: float 8s ease-in-out infinite;
}

.orb-2 {
    width: 300px;
    height: 300px;
    background: var(--md-accent);
    bottom: -50px;
    left: -80px;
    animation: float 10s ease-in-out infinite reverse;
    opacity: 0.2;
}

.orb-3 {
    width: 200px;
    height: 200px;
    background: #8b5cf6;
    top: 50%;
    left: 60%;
    animation: float 12s ease-in-out infinite;
    animation-delay: -4s;
    opacity: 0.15;
}
```

**Step 2: 在 HTML 中添加光球元素**

在 `.page-shell` 内部添加：

```html
<div class="page-shell">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
</div>
```

**Step 3: 提交**

```bash
git add style.css index.html
git commit -m "feat: 添加背景浮动光效装饰"
```

---

## Task 4: 新增技能展示板块

**Files:**
- Modify: `index.html` (添加技能板块)
- Modify: `style.css` (添加技能卡片样式)

**Step 1: 在 HTML 的 board 中添加技能板块**

在 hero-card 之后、weather-card 之前添加（如果 grid 需要调整，见 Step 2）：

```html
<section class="material-card skills-card animate-in">
    <p class="label">SKILLS</p>
    <h3>技术栈</h3>
    <div class="skills-grid">
        <div class="skill-item">
            <i class="fab fa-python"></i>
            <span>Python</span>
            <div class="skill-bar"><div class="skill-fill" style="width:90%"></div></div>
        </div>
        <div class="skill-item">
            <i class="fas fa-brain"></i>
            <span>AI / CV</span>
            <div class="skill-bar"><div class="skill-fill" style="width:85%"></div></div>
        </div>
        <div class="skill-item">
            <i class="fab fa-js"></i>
            <span>JavaScript</span>
            <div class="skill-bar"><div class="skill-fill" style="width:75%"></div></div>
        </div>
        <div class="skill-item">
            <i class="fab fa-html5"></i>
            <span>HTML/CSS</span>
            <div class="skill-bar"><div class="skill-fill" style="width:80%"></div></div>
        </div>
        <div class="skill-item">
            <i class="fas fa-database"></i>
            <span>数据处理</span>
            <div class="skill-bar"><div class="skill-fill" style="width:80%"></div></div>
        </div>
        <div class="skill-item">
            <i class="fab fa-git-alt"></i>
            <span>Git</span>
            <div class="skill-bar"><div class="skill-fill" style="width:78%"></div></div>
        </div>
    </div>
</section>
```

**Step 2: 添加技能卡片 CSS 样式**

```css
.skills-card {
    grid-area: skills;
    padding: var(--md-space-lg);
}

.skills-card h3 {
    margin: 4px 0 14px;
    font-size: 1.1rem;
}

.skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.skill-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skill-item i {
    font-size: 1.2rem;
    color: var(--md-primary);
}

.skill-item span {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--md-text);
}

.skill-bar {
    height: 6px;
    background: var(--md-line);
    border-radius: 3px;
    overflow: hidden;
}

.skill-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--md-primary), var(--md-primary-light));
    border-radius: 3px;
    width: 0;
    animation: skillGrow 1s ease forwards;
    animation-delay: 0.6s;
}

@keyframes skillGrow {
    from { width: 0; }
}
```

**Step 3: 调整 Grid 布局**

更新 `.board` 的 grid-template-areas：

```css
.board {
    grid-template-columns: 1.4fr 1fr 1fr;
    grid-template-areas:
        "hero weather quote"
        "hero skills quote"
        "hero nav1 nav2"
        "hero nav3 nav4";
}
```

添加：
```css
.skills-card { grid-area: skills; }
```

在平板断点更新：
```css
@media (max-width: 1080px) {
    .board {
        grid-template-areas:
            "hero hero"
            "weather quote"
            "skills skills"
            "nav1 nav2"
            "nav3 nav4";
    }
}
```

在移动端断点更新：
```css
@media (max-width: 700px) {
    .board {
        grid-template-areas:
            "hero"
            "weather"
            "quote"
            "skills"
            "nav1"
            "nav2"
            "nav3"
            "nav4";
    }
}
```

**Step 4: 提交**

```bash
git add style.css index.html
git commit -m "feat: 添加技能展示板块"
```

---

## Task 5: 新增项目展示板块

**Files:**
- Modify: `index.html` (添加项目板块)
- Modify: `style.css` (添加项目卡片样式)

**Step 1: 在 HTML 中添加项目展示板块**

在 skills-card 之后添加：

```html
<section class="material-card projects-card animate-in">
    <p class="label">PROJECTS</p>
    <h3>精选项目</h3>
    <div class="projects-list">
        <a href="https://github.com/FeihuXue-dev" class="project-item" target="_blank" rel="noopener">
            <i class="fas fa-image"></i>
            <div class="project-info">
                <h4>裂缝图像分割</h4>
                <p>基于深度学习的裂缝检测与分割系统</p>
            </div>
            <i class="fas fa-arrow-right project-arrow"></i>
        </a>
        <a href="https://cv.gislab.dpdns.org" class="project-item" target="_blank" rel="noopener">
            <i class="fas fa-file-alt"></i>
            <div class="project-info">
                <h4>在线简历系统</h4>
                <p>教育、经历与技能展示</p>
            </div>
            <i class="fas fa-arrow-right project-arrow"></i>
        </a>
        <a href="https://github.com/FeihuXue-dev?tab=repositories" class="project-item" target="_blank" rel="noopener">
            <i class="fas fa-flask"></i>
            <div class="project-info">
                <h4>更多实验项目</h4>
                <p>查看 GitHub 仓库列表</p>
            </div>
            <i class="fas fa-arrow-right project-arrow"></i>
        </a>
    </div>
</section>
```

**Step 2: 添加项目板块 CSS**

```css
.projects-card {
    grid-area: projects;
    padding: var(--md-space-lg);
}

.projects-card h3 {
    margin: 4px 0 14px;
    font-size: 1.1rem;
}

.projects-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.project-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: var(--md-radius-sm);
    background: var(--md-surface);
    border: 1px solid var(--md-line);
    text-decoration: none;
    color: var(--md-text);
    transition: all var(--md-transition-fast);
}

.project-item:hover {
    background: var(--md-surface-hover);
    border-color: var(--md-primary);
    transform: translateX(4px);
}

.project-item > i:first-child {
    font-size: 1.2rem;
    color: var(--md-primary);
}

.project-info h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
}

.project-info p {
    margin: 2px 0 0;
    font-size: 0.82rem;
    color: var(--md-muted);
}

.project-arrow {
    margin-left: auto;
    color: var(--md-muted);
    transition: all var(--md-transition-fast);
}

.project-item:hover .project-arrow {
    color: var(--md-primary);
    transform: translateX(4px);
}
```

**Step 3: 更新 Grid 布局**

```css
.board {
    grid-template-areas:
        "hero weather quote"
        "hero skills projects"
        "hero nav1 nav2"
        "hero nav3 nav4";
}
```

响应式更新：
```css
@media (max-width: 1080px) {
    .board {
        grid-template-areas:
            "hero hero"
            "weather quote"
            "skills projects"
            "nav1 nav2"
            "nav3 nav4";
    }
}

@media (max-width: 700px) {
    .board {
        grid-template-areas:
            "hero"
            "weather"
            "quote"
            "skills"
            "projects"
            "nav1"
            "nav2"
            "nav3"
            "nav4";
    }
}
```

**Step 4: 提交**

```bash
git add style.css index.html
git commit -m "feat: 添加项目展示板块"
```

---

## Task 6: 导航卡片图标与视觉升级

**Files:**
- Modify: `style.css` (升级导航卡片样式)
- Modify: `index.html` (可选：添加图标背景)

**Step 1: 升级导航卡片样式**

替换现有 `.nav-card` 相关样式：

```css
.nav-card {
    text-decoration: none;
    color: var(--md-text);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: var(--md-space-md);
    min-height: 140px;
    padding: var(--md-space-lg);
    transition: all var(--md-transition-base);
    position: relative;
    overflow: hidden;
}

.nav-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--md-primary), var(--md-primary-light));
    opacity: 0;
    transition: opacity var(--md-transition-base);
}

.nav-card:hover::before {
    opacity: 0.06;
}

.nav-card > * {
    position: relative;
    z-index: 1;
}

.nav-card-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--md-radius-sm);
    background: linear-gradient(135deg, var(--md-primary), var(--md-primary-deep));
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.nav-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--md-shadow-2);
    border-color: var(--md-primary);
}

.nav-card h3 {
    font-size: 1.05rem;
    margin: 0;
}

.nav-card p {
    color: var(--md-muted);
    font-size: 0.88rem;
    margin: 0;
}
```

**Step 2: 更新 HTML 中导航卡片图标结构**

将每个 nav-card 的图标包裹在 `nav-card-icon` 中：

```html
<a class="material-card nav-card animate-in" href="...">
    <div class="nav-card-icon"><i class="fab fa-github"></i></div>
    <div>
        <h3>项目仓库</h3>
        <p>查看代码与实验记录</p>
    </div>
</a>
```

对其他三个 nav-card 做同样处理。

**Step 3: 提交**

```bash
git add style.css index.html
git commit -m "style: 升级导航卡片视觉效果"
```

---

## Task 7: 返回顶部按钮与滚动体验

**Files:**
- Modify: `index.html` (添加返回顶部按钮)
- Modify: `style.css` (添加按钮样式)
- Modify: `script.js` (添加滚动逻辑)

**Step 1: 在 HTML 中添加返回顶部按钮**

在 `</body>` 前添加：

```html
<button id="backToTop" class="back-to-top" aria-label="返回顶部">
    <i class="fas fa-chevron-up"></i>
</button>
```

**Step 2: 添加 CSS 样式**

```css
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 100;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: var(--md-primary);
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: var(--md-shadow-1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(12px);
    transition: all var(--md-transition-base);
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    background: var(--md-primary-deep);
    transform: translateY(-3px);
    box-shadow: var(--md-shadow-2);
}
```

**Step 3: 添加 JavaScript 滚动逻辑**

在 `script.js` 中添加：

```javascript
// === 返回顶部 ===
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
}, { passive: true });

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
```

**Step 4: 添加平滑滚动**

在 `style.css` 的 `*` 选择器中添加：

```css
html {
    scroll-behavior: smooth;
}
```

**Step 5: 提交**

```bash
git add style.css index.html script.js
git commit -m "feat: 添加返回顶部按钮和平滑滚动"
```

---

## Task 8: 响应式体验全面优化

**Files:**
- Modify: `style.css` (优化所有断点和触摸体验)

**Step 1: 添加触摸优化**

```css
/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
    .nav-card {
        min-height: 120px;
    }

    .nav-card:hover {
        transform: none;
    }

    .nav-card:active {
        transform: scale(0.98);
    }

    .project-item:active {
        transform: scale(0.98);
    }

    .back-to-top {
        bottom: 20px;
        right: 20px;
        width: 52px;
        height: 52px;
    }
}
```

**Step 2: 添加中间断点 (900px)**

```css
@media (max-width: 900px) {
    .board {
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            "hero hero"
            "weather quote"
            "skills projects"
            "nav1 nav2"
            "nav3 nav4";
    }

    .hero-card {
        grid-template-columns: 200px 1fr;
        grid-template-rows: auto;
        align-items: center;
    }

    .avatar {
        width: 200px;
        border-radius: var(--md-radius-md);
    }

    .skills-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

**Step 3: 优化 1080px 断点**

更新现有 `@media (max-width: 1080px)` 中的 skills 和 projects 布局。

**Step 4: 优化 700px 移动端断点**

```css
@media (max-width: 700px) {
    .page {
        padding: 12px 0;
    }

    .top-appbar {
        padding: 14px 16px;
    }

    .app-logo {
        width: 44px;
        height: 44px;
    }

    .hero-card {
        padding: 20px;
    }

    .avatar {
        width: min(100%, 100%);
        max-width: 260px;
        margin: 0 auto;
    }

    .hero-card h2 {
        text-align: center;
    }

    .hero-card > div:last-child {
        text-align: center;
    }

    .skills-grid {
        grid-template-columns: 1fr 1fr;
    }

    .nav-card {
        min-height: 120px;
        padding: var(--md-space-md);
    }

    .material-card {
        border-radius: var(--md-radius-md);
    }

    .orb {
        opacity: 0.2;
    }
}
```

**Step 5: 添加超小屏幕适配**

```css
@media (max-width: 420px) {
    .page {
        width: 96vw;
    }

    .skills-grid {
        grid-template-columns: 1fr;
    }

    .time-line {
        font-size: 1.6rem;
    }
}
```

**Step 6: 提交**

```bash
git add style.css
git commit -m "style: 全面优化响应式布局和触摸体验"
```

---

## Task 9: Hero 卡片视觉升级

**Files:**
- Modify: `style.css` (增强 hero 卡片样式)
- Modify: `index.html` (可选：添加装饰元素)

**Step 1: 升级 Hero 卡片样式**

```css
.hero-card {
    grid-area: hero;
    padding: var(--md-space-xl);
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--md-space-md);
    align-content: start;
    position: relative;
    overflow: hidden;
}

.hero-card::after {
    content: "";
    position: absolute;
    top: -50%;
    right: -30%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, var(--md-primary-light), transparent 70%);
    opacity: 0.08;
    pointer-events: none;
}

.avatar {
    width: min(100%, 330px);
    aspect-ratio: 1 / 1;
    border-radius: var(--md-radius-md);
    object-fit: cover;
    box-shadow: var(--md-shadow-2);
    transition: transform var(--md-transition-base);
}

.avatar:hover {
    transform: scale(1.02) rotate(1deg);
}

.hero-card h2 {
    margin: 2px 0 10px;
    font-size: clamp(1.24rem, 2.8vw, 1.7rem);
    background: linear-gradient(135deg, var(--md-text), var(--md-primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

**Step 2: 提交**

```bash
git add style.css index.html
git commit -m "style: 升级 Hero 卡片视觉效果"
```

---

## Task 10: 天气卡片和语录卡片美化

**Files:**
- Modify: `style.css` (美化天气和语录卡片)

**Step 1: 升级天气卡片**

```css
.weather-card {
    grid-area: weather;
    padding: var(--md-space-lg);
    background: linear-gradient(135deg, rgba(34, 50, 94, 0.86), rgba(15, 25, 50, 0.92));
    color: var(--md-text-inverse);
    border-color: rgba(255, 255, 255, 0.15);
    position: relative;
    overflow: hidden;
}

.weather-card::before {
    content: "";
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 70%);
    border-radius: 50%;
}

.time-line {
    margin: 8px 0;
    font-size: clamp(1.8rem, 3.6vw, 2.5rem);
    line-height: 1;
    letter-spacing: 0.06em;
    font-family: var(--font-mono);
    text-shadow: 0 0 20px rgba(118, 165, 255, 0.3);
}
```

**Step 2: 升级语录卡片**

```css
.quote-card {
    grid-area: quote;
    padding: var(--md-space-lg);
    display: grid;
    align-content: space-between;
    position: relative;
}

.quote-card::before {
    content: "\201C";
    position: absolute;
    top: 10px;
    left: 16px;
    font-size: 4rem;
    color: var(--md-primary);
    opacity: 0.15;
    font-family: Georgia, serif;
    line-height: 1;
}

.quote {
    font-size: 1.05rem;
    line-height: 1.65;
    font-style: italic;
    position: relative;
    z-index: 1;
}
```

**Step 3: 提交**

```bash
git add style.css
git commit -m "style: 美化天气和语录卡片"
```

---

## Task 11: 页脚和整体细节打磨

**Files:**
- Modify: `style.css` (页脚和全局细节)
- Modify: `index.html` (页脚内容更新)

**Step 1: 升级页脚样式**

```css
.footer {
    margin-top: var(--md-space-md);
    text-align: center;
    color: var(--md-muted-inverse);
    font-size: 0.85rem;
    padding: var(--md-space-md) 0;
    position: relative;
}

.footer::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--md-primary), transparent);
}
```

**Step 2: 添加全局选择样式**

```css
::selection {
    background: var(--md-primary);
    color: #fff;
}
```

**Step 3: 添加滚动条美化**

```css
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: var(--md-line-strong);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--md-muted);
}
```

**Step 4: 更新页脚 HTML**

```html
<footer class="footer">
    <p>Copyright &copy; 2026 Xuefeihu · Built with ❤️</p>
</footer>
```

**Step 5: 提交**

```bash
git add style.css index.html
git commit -m "style: 打磨页脚和全局细节"
```

---

## Task 12: README 更新与最终验证

**Files:**
- Modify: `README.md` (全面更新文档)

**Step 1: 更新 README.md**

```markdown
# Personal Homepage Website

一个 Material 风格的个人主页，采用卡片式布局整合多种动态模块，支持深色模式切换。

## ✨ 特性

- 🌤️ 武汉实时天气（Open-Meteo API）
- 🕐 实时时钟（Asia/Shanghai 时区）
- 💬 随机哲理语句（Hitokoto API）
- 🌙 深色/浅色模式切换（本地存储偏好）
- 📊 技术栈技能展示
- 🚀 精选项目展示
- ✨ 页面加载动画 + 卡片入场效果
- 🔮 背景浮动光效装饰
- ⬆️ 返回顶部按钮
- 📱 全面响应式布局（4 个断点）
- 👆 触摸设备优化

## 技术栈

- HTML5: `index.html`
- CSS3: `style.css` (CSS Variables, Grid, Animations, Media Queries)
- Vanilla JavaScript: `script.js` (ES6+)
- 图标: Font Awesome CDN
- 字体: Google Fonts (Roboto / Noto Sans SC / Orbitron)

## 目录结构

...（保持原有结构说明）

## 本地预览

...（保持原有说明）

## 部署

...（保持原有部署说明）

## 自定义指南

- 修改主题偏好：页面右上角月亮/太阳按钮
- 修改头像：替换 `pictures/小猫.jpg`
- 修改背景图：替换 `pictures/武汉大学大暑.jpg`
- 修改技能：编辑 `index.html` 中 skills-card 板块
- 修改项目：编辑 `index.html` 中 projects-card 板块
- 修改配色：编辑 `style.css` 中 `:root` 变量

...（保持 FAQ 和 License）
```

**Step 2: 最终验证**

在本地启动服务器进行全面测试：

```bash
python -m http.server 8080
```

检查清单：
- [ ] 浅色/深色模式切换正常
- [ ] 加载动画正常显示
- [ ] 卡片入场动画正常
- [ ] 背景光效正常
- [ ] 天气数据正常显示
- [ ] 时钟正常运行
- [ ] 语录正常加载
- [ ] 技能进度条动画正常
- [ ] 所有链接可点击
- [ ] 返回顶部按钮正常显示/隐藏
- [ ] 4 个断点响应式正常
- [ ] 触摸设备交互正常

**Step 3: 最终提交**

```bash
git add README.md
git commit -m "docs: 更新 README 反映所有新功能"
```

---

## 总结

本计划包含 **12 个 Task**，预计 **30-50 个 Steps**，按以下顺序执行：

1. **CSS 变量体系与深色模式** → 奠定主题基础
2. **加载动画与卡片入场** → 提升第一印象
3. **背景光效装饰** → 视觉层次增强
4. **技能展示板块** → 内容扩充
5. **项目展示板块** → 内容扩充
6. **导航卡片视觉升级** → 交互优化
7. **返回顶部按钮** → 导航体验
8. **响应式全面优化** → 多端适配
9. **Hero 卡片升级** → 视觉焦点
10. **天气/语录卡片美化** → 细节打磨
11. **页脚和全局细节** → 品质感
12. **README 更新与验证** → 文档完善

每个 Task 完成后立即提交，确保可随时回滚。
