# Au Hot Games - Australia Ewallet Casino

静态网站项目，使用 Vercel 自动部署。

## 部署步骤

### 1. 创建 GitHub 仓库

1. 在 GitHub 上创建新仓库（例如：`auhotgame`）
2. 不要初始化 README、.gitignore 或 license（我们已经有了）

### 2. 连接本地仓库到 GitHub

```bash
# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 3. 在 Vercel 中连接 GitHub 仓库

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择你刚创建的 GitHub 仓库
4. Vercel 会自动检测配置：
   - Framework Preset: Other
   - Root Directory: `./` (默认)
   - Build Command: 留空（静态网站不需要构建）
   - Output Directory: `./` (默认)
5. 点击 "Deploy"

### 4. 自动部署

之后每次你 push 代码到 GitHub，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Your commit message"
git push
```

## 项目结构

```
auhotgame/
├── index.html          # 主页面
├── css/
│   └── styles.css     # 样式文件
├── js/
│   └── main.js        # JavaScript 文件
├── img/               # 图片资源
├── vercel.json        # Vercel 配置文件
└── .gitignore        # Git 忽略文件
```

## 本地开发

直接在浏览器中打开 `index.html` 即可预览，或使用简单的 HTTP 服务器：

```bash
# Python 3
python3 -m http.server 8000

# Node.js (需要安装 http-server)
npx http-server -p 8000
```

然后访问 http://localhost:8000
