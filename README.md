# terminal-blog

这是一个“终端风格个人博客”项目，使用 Vite + TypeScript + xterm.js 实现。

它的目标是：

- 像 Linux 终端一样浏览博客
- 文章以 Markdown 方式存储
- 命令系统可扩展
- 目录结构清晰，便于后续加功能

---

## 项目结构

```text
terminal-blog/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
└── src/
    ├── app/
    ├── content/
    ├── fs/
    ├── shell/
    ├── terminal/
    ├── utils/
    └── styles.css
```

---

## 已支持的功能

- 终端界面
- 基础命令
- 虚拟文件系统
- Markdown 渲染
- 博客文章读取
- 简单管道

---

## 命令说明

目前可用命令：

```bash
ls
cat
head
tail
grep
find
tree
more
less
wc
clear
exit
whoami
help
cd
pwd
read
```

示例：

```bash
help
ls /bin
ls /posts
cat /about.md
head /about.md
tail /about.md
grep blog /help.md
find /
tree /
more /help.md
less /help.md
wc /help.md
whoami
read hello-world
exit
```

---

## 本地启动

先安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

浏览器打开终端提示的地址，一般是：

```text
http://localhost:5173
```

---

## 构建

构建生产版本：

```bash
npm run build
```

构建完成后会生成 `dist/` 目录。

预览构建结果：

```bash
npm run preview
```

---

## 依赖管理

### 安装依赖

```bash
npm install
```

### 删除依赖

删除全部依赖并重新安装：

```bash
rm -rf node_modules package-lock.json
npm install
```

如果你想只删除依赖后重新装：

```bash
rm -rf node_modules
npm install
```

### 清理构建产物

```bash
rm -rf dist
```

---

## 扩展建议

后续可以继续加：

- 命令历史
- Tab 自动补全
- 文章分类和标签
- 文章列表页
- 手机端适配优化
- 主题切换
- 更完整的文件系统
- `bin` 目录命令热插拔

---

## 开发顺序建议

1. 先保证终端交互稳定
2. 再补文章系统
3. 再补搜索与标签
4. 最后做视觉效果和主题

---

## 运行检查

如果启动报错，可以依次排查：

```bash
npm install
npm run build
npm run dev
```

如果需要清理并重装依赖：

```bash
rm -rf node_modules package-lock.json
npm install
```

如果需要清理构建产物：

```bash
rm -rf dist
```

如果仍然有异常，先看终端报错信息，再检查对应文件是否被改动。
