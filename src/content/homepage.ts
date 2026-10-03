import banner from './home-banner.txt?raw';

// Edit this file and home-banner.txt to personalize the terminal homepage.
export const homepage = {
  name: 'Harden',
  email: 'your-name@example.com',
  user: 'guest',
  host: 'terminal-blog',
  banner,
  compactBanner: '[ HARDEN / BLOG ]',
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

export function makeWelcome(columns: number): string {
  const art = homepage.banner.trimEnd();
  const width = Math.max(...art.split('\n').map(line => line.length));
  return [
    `# ${homepage.name} <${homepage.email}>`,
    '-'.repeat(Math.min(40, Math.max(1, columns))),
    columns >= width ? art : homepage.compactBanner,
    '', ...homepage.bio, '',
    ...homepage.links.map(link => `  | ${link}`),
    '', 'This page doubles as a shell. Type help to begin.', '', '',
  ].join('\n');
}
