# 裂缝分割研究展示网页 - 部署指南

## 📦 文件结构

```
crack-segmentation-website/
├── index.html              # 主页面文件
├── assets/
│   ├── index-DK2F8Z-H.js  # JavaScript 代码（已压缩）
│   └── index-BoB_XE_w.css # CSS 样式表（已压缩）
├── images/
│   ├── hero-bg.png        # 英雄区背景图
│   ├── architecture-diagram.png  # 架构图
│   ├── data-imbalance.png        # 数据不平衡示意图
│   └── feature-fusion.png        # 特征融合示意图
└── DEPLOYMENT_GUIDE.md    # 本文件
```

## 🚀 部署方式

### 方式 1: 自托管服务器（VPS/虚拟主机）

#### 步骤 1: 上传文件
```bash
# 使用 FTP/SFTP 或 SCP 上传所有文件到你的服务器
# 例如，上传到 /var/www/html/crack-research/ 目录

scp -r crack-seg-export/* user@your-server.com:/var/www/html/crack-research/
```

#### 步骤 2: 配置 Web 服务器

**如果使用 Nginx：**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html/crack-research;
    index index.html;

    # 处理 SPA 路由（如果需要）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**如果使用 Apache：**
```apache
<Directory /var/www/html/crack-research>
    Options -MultiViews
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.html [QSA,L]
</Directory>
```

#### 步骤 3: 重启 Web 服务器
```bash
# Nginx
sudo systemctl restart nginx

# Apache
sudo systemctl restart apache2
```

---

### 方式 2: GitHub Pages（免费托管）

#### 步骤 1: 创建 GitHub 仓库
1. 在 GitHub 上创建一个新仓库，命名为 `crack-segmentation-research`
2. 克隆仓库到本地

#### 步骤 2: 上传文件
```bash
cd crack-segmentation-research
cp -r /path/to/crack-seg-export/* .
git add .
git commit -m "Initial commit: Add crack segmentation research website"
git push origin main
```

#### 步骤 3: 启用 GitHub Pages
1. 在仓库设置中，找到 "Pages" 选项
2. 选择 "Deploy from a branch"
3. 选择 `main` 分支和 `/ (root)` 目录
4. 保存

你的网站将在 `https://your-username.github.io/crack-segmentation-research/` 上线。

---

### 方式 3: Netlify（推荐用于静态网站）

#### 步骤 1: 连接 GitHub
1. 访问 [Netlify](https://www.netlify.com/)
2. 点击 "Sign up" 并用 GitHub 账号登录
3. 授权 Netlify 访问你的 GitHub 仓库

#### 步骤 2: 创建新站点
1. 点击 "New site from Git"
2. 选择你的 GitHub 仓库
3. 设置构建命令为空（因为已经是编译后的文件）
4. 设置发布目录为 `.`（当前目录）

#### 步骤 3: 自动部署
每次你推送代码到 GitHub，Netlify 会自动部署新版本。

---

### 方式 4: Vercel（推荐用于 React 应用）

#### 步骤 1: 导入项目
1. 访问 [Vercel](https://vercel.com/)
2. 点击 "Import Project"
3. 选择 GitHub 仓库

#### 步骤 2: 配置部署
1. 框架选择：`Other`（因为已编译）
2. 构建命令：留空
3. 输出目录：`.`

#### 步骤 3: 部署
点击 "Deploy"，Vercel 会自动为你的网站分配一个域名。

---

## 🔧 常见问题

### Q1: 图片无法加载
**解决方案**：确保 `images/` 文件夹与 `index.html` 在同一目录，且所有图片文件都已上传。

### Q2: 样式不显示
**解决方案**：检查 `assets/` 文件夹中的 CSS 文件是否存在。如果路径不对，编辑 `index.html` 中的 CSS 链接：
```html
<!-- 修改这一行 -->
<link rel="stylesheet" crossorigin href="/assets/index-BoB_XE_w.css">
<!-- 为 -->
<link rel="stylesheet" crossorigin href="./assets/index-BoB_XE_w.css">
```

### Q3: 导航链接不工作
**解决方案**：这是一个单页应用（SPA），需要在服务器配置中添加 URL 重写规则。参考上面的 Nginx/Apache 配置。

### Q4: 页面加载缓慢
**解决方案**：
- 启用 GZIP 压缩
- 配置 CDN 加速
- 启用浏览器缓存（见上面的 Nginx 配置）

---

## 📝 自定义域名

如果你想使用自己的域名（如 `crack-research.example.com`）：

### 对于自托管服务器：
1. 购买域名
2. 在 DNS 提供商处添加 A 记录，指向你的服务器 IP
3. 在 Web 服务器配置中更新 `server_name`

### 对于 GitHub Pages：
1. 在仓库根目录创建 `CNAME` 文件，内容为你的域名
2. 在 DNS 提供商处添加 CNAME 记录

### 对于 Netlify/Vercel：
1. 在项目设置中添加自定义域名
2. 按照提示更新 DNS 记录

---

## 🔐 HTTPS 配置

### 对于自托管服务器：
使用 Let's Encrypt 免费证书：
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### 对于 Netlify/Vercel：
自动配置，无需额外操作。

---

## 📊 性能优化建议

1. **启用 GZIP 压缩**：减少传输大小
2. **配置 CDN**：加速全球访问
3. **设置缓存策略**：减少重复请求
4. **压缩图片**：使用 WebP 格式

---

## 📞 技术支持

如有问题，请检查：
- 所有文件是否完整上传
- 服务器配置是否正确
- 浏览器控制台是否有错误信息（F12 打开）
- 网络连接是否正常

---

**祝部署顺利！** 🎉
