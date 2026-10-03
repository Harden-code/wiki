# terminal-blog

模仿 https://jiangyy.github.io/ 的终端风格个人博客，使用 Vite + TypeScript + xterm.js，文章保存为 Markdown。

## 项目结构

```text
wiki/
├── bin/                  # 命令实现；index.ts 自动发现并注册命令
├── src/
│   ├── app/              # 应用启动
│   ├── content/posts/    # Markdown 文章（支持分类子目录）
│   ├── content/files/    # 映射到虚拟 /files 的文本文件
│   ├── content/homepage.ts    # 欢迎页身份、简介和入口配置
│   ├── content/home-banner.txt # ASCII 图案
│   ├── content/          # 文章加载与安全 Markdown 渲染
│   ├── fs/               # 虚拟文件系统
│   ├── shell/            # 解析器、运行时、公共命令工具
│   ├── terminal/         # 输入、历史、分页、文章阅读窗口
│   ├── utils/
│   └── styles.css
├── public/               # 可自行创建：图片、PDF 等静态附件
├── tests/                # 命令及文件系统回归测试
├── index.html
└── package.json
```

**源码 `bin/` 与网页中的虚拟 `/bin` 不同于操作系统 `/bin`。** 所有命令自动显示在虚拟 `/bin`；既可以运行 `ls /posts`，也可以运行 `/bin/ls /posts`。在 `cd /bin` 后可使用 `./ls`。

## 命令实现状态

以下 17 个命令均已实现（不是完整 POSIX shell，仅支持列出的参数）：

| 命令 | 支持范围 |
| --- | --- |
| `help [command]` | 自动列出注册命令，查询命令用法 |
| `ls [path]` | 列出目录或单个文件，命令前显示 `*` |
| `cat [file ...]` | 拼接多个文件；不传文件或传 `-` 时读取管道输入 |
| `head [-n count] [file]` | 默认前 10 行，支持非负整数行数 |
| `tail [-n count] [file]` | 默认后 10 行，支持非负整数行数 |
| `grep <pattern> [file]` | 按字面子串筛选行；无匹配返回状态 1，不支持正则或选项 |
| `find [path]` | 递归列出路径，不支持 `-name` 等筛选选项 |
| `tree [path]` | 缩进显示目录树 |
| `more [file]` | 分页：空格下一页、Enter 下一行、`q` 退出 |
| `less [file]` | 同上，另外支持 `b` 上一页 |
| `wc [file]` | 统计换行符、单词、UTF-8 字节数（无末尾换行的最后一行不计入换行数） |
| `clear` | 清屏 |
| `exit` | 结束当前终端会话；刷新网页重新进入，不会跳转参考网站 |
| `whoami` | 显示当前虚拟用户 |
| `cd [path]` | 改变工作目录，省略路径时回到 `/`，拒绝进入文件 |
| `pwd` | 显示当前工作目录 |
| `read <slug\|path>` | 在阅读窗口中渲染 Markdown；关闭按钮或 Escape 返回终端 |

文件命令按当前工作目录解析相对路径。只有 `read` 额外支持文章 slug，例如 `read hello-world`。
`head`、`tail`、`grep`、`wc`、`more`、`less` 不传文件时读取管道输入。管道用于文本传递；任一命令失败即停止。管道中的 `read` 输出原始 Markdown，`more/less` 不进入交互分页。

解析器支持单/双引号、空白分隔、反斜杠转义和 `|`，不支持重定向、变量展开、通配符、`&&` 或真实系统命令。未闭合引号及空管道会报告语法错误。

## 示例

```bash
help
help head
ls /bin
/bin/ls /posts
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
cd /posts
pwd
cat hello-world.md
cd ..
cat /about.md | head -n 3
read hello-world | grep "欢迎"
clear
exit
```

终端支持上/下箭头历史、Backspace 和 Ctrl+C 清除当前输入。输入只能在末尾追加或删除；暂未实现 Tab 补全、左右箭头编辑、完整终端编辑器。粘贴多行内容会合并为空格，不会自动执行其中的命令。

## 操作指南

### 先区分两种“终端”

- **电脑终端**：macOS Terminal、iTerm 或 VS Code 终端。用来运行 `npm`、创建真实文件和编辑源码。
- **网页终端**：浏览器里的博客界面。只能浏览打包好的虚拟文件，不会读写你电脑的文件。

下文“电脑终端”的命令均在项目目录执行：

```bash
cd /Users/harden/python/wiki/wiki
```

不要在网页终端执行 `npm`、`mkdir`、`touch`、`cp` 或 `>`：这些系统命令和重定向目前没有实现。

### 1. 配置主页和 ASCII 图案

参考 jyy 首页的“姓名/邮箱 → 字符图案 → 简介 → 入口提示”布局，项目已配置一份 **HARDEN** 欢迎页。没有复制 jyy 的个人身份信息；请替换成自己的信息。

#### 修改身份、简介和首页入口

用编辑器打开 **`src/content/homepage.ts`**，修改 `homepage` 对象：

```ts
export const homepage = {
  name: '你的名字',
  email: 'you@example.com',
  user: 'harden',               // whoami 的输出、提示符中的用户
  host: 'my-blog',              // 提示符中的站点名
  banner,                      // 保留：来自 home-banner.txt
  compactBanner: '[ MY BLOG ]', // 窄屏使用的短图案
  bio: [
    'Developer · Lifelong learner',
    '记录代码、学习笔记与生活。',
  ],
  links: [
    '个人介绍: read /about.md',
    '博客文章: ls /posts',
    '命令列表: help',
  ],
};
```

只替换对象中的值，保留文件顶部的 `banner` 导入和下面的 `makeWelcome()` 函数。配置后提示符会变成 `harden@my-blog:/$`。`links` 是文本入口提示，访客需要输入相应命令；它们不是可点击的网页导航链接。真正可点击的外链可以写在个人介绍 Markdown 中。

#### 修改字符图案

打开 **`src/content/home-banner.txt`**，直接修改文本，保留空格、换行和反斜杠。不需要 HTML，也不需要给反斜杠加转义。

例如可以换成一个更紧凑的图案：

```text
+-----------------------+
|       MY BLOG         |
|   code / notes / life |
+-----------------------+
```

当前默认是 HARDEN 大字图案。也可以将 ASCII 字体生成器生成的英文名字复制到该文件。建议每行不超过 60 个字符、4～6 行高，使用空格而不是 Tab。英文 ASCII 宽度最稳定，中文和 emoji 可能因终端字符宽度不同而错位。

首屏会根据终端列数选择完整图案或 `compactBanner`。修改后刷新网页；窗口尺寸变化后重新刷新可重新选择图案。

#### 修改网页标题、颜色和字体

- 浏览器标签页标题：修改 **`index.html`** 的 `<title>terminal-blog</title>`。
- 终端颜色：修改 **`src/terminal/theme.ts`**。
- 页面背景、边框和阅读窗口：修改 **`src/styles.css`**。
- 终端字号、字体：修改 **`src/terminal/terminal.ts`** 中的 `fontSize`、`fontFamily`。

### 2. 放博客、个人介绍和其他文件

#### 2.1 放一篇博客

在电脑终端创建文件，随后用编辑器填写内容：

```bash
mkdir -p src/content/posts
# 只创建新文件；touch 不会清空已有内容
touch src/content/posts/my-first-post.md
```

在 `my-first-post.md` 中写入：

```markdown
# 我的第一篇博客

这里写正文。

## 学习笔记

- 第一条记录
- 第二条记录

[我的 GitHub](https://github.com/your-name)
```

网页终端中的访问方式：

```bash
ls /posts
read my-first-post
# 或使用完整路径
read /posts/my-first-post.md
# 查看原始 Markdown
cat /posts/my-first-post.md
```

文件名去掉 `.md` 就是文章 slug。建议使用英文小写和连字符，避免空格。文章标题取第一个一级标题；日期、标签及 frontmatter 暂未解析。

#### 2.2 按目录分类博客

电脑终端：

```bash
mkdir -p src/content/posts/linux
touch src/content/posts/linux/process.md
```

编辑 `process.md`，例如写入 `# Linux 进程笔记` 和正文。子目录会保留到网页虚拟文件系统中：

```bash
# 以下在网页终端运行
ls /posts/linux
read linux/process
read /posts/linux/process.md
cd /posts/linux
cat process.md
cd /
```

分类文章的 slug 带目录前缀，如 `linux/process`，可以避免不同分类中的同名文章互相覆盖。

#### 2.3 修改个人介绍

编辑 **`src/content/posts/about.md`**。同一份内容同时用于 `/about.md` 与 `/posts/about.md`，不用维护两份。

```bash
# 网页终端
read /about.md
```

#### 2.4 放可在终端阅读的文本文件

放入 **`src/content/files/`**，目录结构会映射到网页的 **`/files/`**。已附带 `readme.txt` 示例。

电脑终端：

```bash
mkdir -p src/content/files/notes
touch src/content/files/notes/todo.txt
```

用编辑器在 `todo.txt` 写入待办事项后，在网页终端运行：

```bash
ls /files
cat /files/notes/todo.txt
less /files/notes/todo.txt
# 文本中的 Markdown 也可用 read 渲染
read /files/guide.md
```

最后一条需要先创建 `src/content/files/guide.md`。目前自动加载的后缀是 `.txt`、`.md`、`.json`、`.csv`、`.log`、`.yaml`、`.yml`，均按 UTF-8 文本处理。新增其他文本格式可修改 **`src/fs/seed.ts`** 的 glob 后缀列表。不要在这里放 PDF、图片等二进制文件。

#### 2.5 放图片、PDF 和下载附件

在电脑终端创建 **`public/`** 下的目录，然后把自己的文件复制进去：

```bash
mkdir -p public/images public/files
# 将下面的来源路径换成你电脑上的实际文件
cp ~/Downloads/avatar.png public/images/avatar.png
cp ~/Downloads/resume.pdf public/files/resume.pdf
```

`public` 中的资源按原样发布，不需要出现在网页虚拟 `/files` 中，也不能用 `cat` 读取。Markdown 中这样引用（适用于本地和域名根路径部署）：

```markdown
![头像](/images/avatar.png)

[打开简历 PDF](/files/resume.pdf)
```

本地还可以直接打开 `http://localhost:5173/files/resume.pdf`。路径中不包含 `public`，不要写成 `/public/files/resume.pdf`。

这些链接是**网站资源 URL**，不是虚拟文件系统路径，恰好同样叫 `/files` 也属于两套不同的机制。Markdown 阅读窗口使用 DOMPurify 清理 HTML，外链带 `noopener noreferrer`。

如果以后部署到 `/my-blog/` 这样的子路径，需要配置 Vite 的 `base`，并把 Markdown 资源链接改为相应的 `/my-blog/images/...`、`/my-blog/files/...`；当前指南的根路径写法不会自动添加部署前缀。

**安全提醒：`public/`、`posts/`、`files/` 内容均会公开发布。不要放密码、API token、私钥或隐私材料。**

### 3. 怎么创建文件和目录

#### 在电脑上创建（永久保存）

在电脑终端执行：

```bash
# 一次创建多层目录；已有目录不会报错
mkdir -p src/content/posts/python

# 创建空文件；已有文件不会被清空
touch src/content/posts/python/basics.md

# 拷贝已有文章（目标同名文件可能被覆盖，-i 会先询问）
cp -i ~/Documents/basics.md src/content/posts/python/basics.md
```

也可以在 VS Code 文件树中右键目录 → “新建文件 / 新建文件夹”，随后编辑并保存。

目录中有支持格式的文件后，会自动出现在网页里。**只创建空文件夹不会自动显示**，因为 Vite 收集的是文件，不是空目录。空 `.md` 文件虽然可创建，但需要填入正文才能正常阅读。

#### 在网页中创建（当前不支持写入命令）

网页终端当前没有 `mkdir`、`touch`、`vim`、`nano`，也不支持 `echo ... > file`。它是只读的博客浏览界面，无法直接保存到项目源码。

开发者若需要一个没有文件的虚拟目录，可以修改 **`src/shell/runtime.ts`**：在构造函数中的 `this.fs = new VirtualFileSystem(...)` **之后**加入：

```ts
this.fs.ensureDir('/projects');
this.fs.ensureDir('/archive/2026');
```

刷新网页后就可以 `ls /`、`cd /projects`。这只是在内存中创建虚拟目录，不会生成电脑上的目录；代码在每次页面启动时重新执行。

同样，可以在 **`src/fs/seed.ts`** 的 `seedFiles` 数组内加入固定虚拟文件：

```ts
{ path: '/projects/intro.txt', content: '我的项目列表\n' },
```

父目录会自动创建，网页里可运行 `cat /projects/intro.txt`。这些属于开发时配置；如果以后添加交互写入功能，还需要单独设计 localStorage 或后端持久化，不能直接把内存修改当作保存。

### 4. 修改后怎么检查和发布

```bash
# 电脑终端：开发预览
npm run dev

# 发布前检查
npm test
npm run typecheck
npm run build
npm run preview
```

开发时 Vite 会监听文件变化，但已经存在的网页会话需要重新初始化虚拟文件系统：修改内容后**刷新网页**最可靠。生产环境必须重新构建并部署 `dist/`，只修改本地 `.md` 文件不会更新已经发布的网站。

## 扩展命令

在 `bin/` 新建 TypeScript 模块，导出名称以 `Command` 结尾的 `CommandDefinition`：

```ts
import type { CommandDefinition } from '../src/shell/types';
import { ok } from '../src/shell/shell';

export const helloCommand: CommandDefinition = {
  name: 'hello',
  description: 'Say hello',
  usage: 'hello',
  handler: () => ok('Hello!'),
};
```

`bin/index.ts` 自动收集命令，运行时从同一份注册表生成 `/bin` 和 `help`，无需手动维护命令列表。开发环境由 Vite 热更新，生产环境需要重新构建；不支持运行时上传任意脚本。

## 本地运行

建议使用 Node.js 22.12+ 或 24 LTS。

```bash
# 如果当前位于外层仓库 /Users/harden/python/wiki，先进入实际项目
cd wiki
npm ci
npm run dev
```

若已经位于包含本 README 和 package.json 的目录，跳过 `cd wiki`。浏览器打开终端提示的地址，默认 http://localhost:5173 。

## 检查、构建与预览

```bash
npm test
npm run typecheck
npm run build
npm run preview
npm audit
```

生产构建写入 `dist/`，预览默认 http://localhost:4173 。端口被占用时以 Vite 实际输出为准。

## 依赖与清理

```bash
npm install           # 修改依赖后更新 lockfile
npm ci                # 按 lockfile 安装/重装依赖
rm -rf dist           # 清理构建产物
```

保留 `package-lock.json` 以保证可复现安装。遇到安装问题，先确认 Node/npm 版本，优先使用 `npm ci`，不建议常规删除 lockfile。

## 本次检查记录

- 原 README 命令均已补齐基础行为，修复 `cd` 无效、`head/tail` 丢失文件参数及相对路径错误。
- `more/less` 实现交互分页，`read` 使用安全的 Markdown 阅读窗口，而非直接打印 HTML。
- 文章由实际 Markdown 文件加载，不再使用脱节的硬编码文章。
- 修复缺失 xterm CSS、终端高度与自适应、退出后继续输入、异步重复提交、控制序列污染输入等问题。
- 添加 36 项回归测试，覆盖 README 示例、命令注册、路径、管道、错误输入、文件系统保护、主页配置和文本文件加载。
