import { loadPosts } from '../content/loader';

const posts = loadPosts();
// Only text formats are bundled into the virtual filesystem. Binary assets belong in public/.
const files = import.meta.glob<string>('../content/files/**/*.{txt,md,json,csv,log,yaml,yml}', {
  eager: true, query: '?raw', import: 'default',
});
export const seedFiles = [
  { path: '/about.md', content: posts.find(post => post.slug === 'about')?.body ?? '# About\n' },
  { path: '/help.md', content: '# Help\n\nUse `help` to list commands in /bin.\nBrowse the blog with `ls /posts` and `read hello-world`.\nUse `cat /about.md | head -n 3` for pipes.\nUse Space/Enter and q in more/less; b goes backwards in less.\n' },
  ...posts.map(post => ({ path: `/posts/${post.slug}.md`, content: post.body, mime: 'text/markdown' })),
  ...Object.entries(files).map(([path, content]) => ({
    path: path.replace('../content/files/', '/files/'), content,
  })),
];
