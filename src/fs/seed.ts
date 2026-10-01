export const seedFiles = [
  { path: '/about.md', content: '# About\n\nThis will become your personal homepage.' },
  { path: '/help.md', content: '# Help\n\nUse `help`, `ls`, `cat`, `cd`, `tree`, `read`, `clear`.' },
  {
    path: '/posts/hello-world.md',
    content: '# Hello World\n\nYour first post goes here.\n\n- add tags\n- add images\n- add links',
  },
  {
    path: '/posts/linux-notes.md',
    content: '# Linux Notes\n\nA blog post can be stored as a file in the virtual filesystem.',
  },
];

export const commandSeeds = [
  { name: 'ls', target: 'ls', description: 'List directory contents' },
  { name: 'cat', target: 'cat', description: 'Print file contents' },
  { name: 'head', target: 'head', description: 'Show first lines' },
  { name: 'tail', target: 'tail', description: 'Show last lines' },
  { name: 'grep', target: 'grep', description: 'Filter lines by pattern' },
  { name: 'find', target: 'find', description: 'Find files and directories' },
  { name: 'tree', target: 'tree', description: 'Show a directory tree' },
  { name: 'more', target: 'more', description: 'Page through content' },
  { name: 'less', target: 'less', description: 'Page through content' },
  { name: 'wc', target: 'wc', description: 'Count lines, words and bytes' },
  { name: 'clear', target: 'clear', description: 'Clear the terminal screen' },
  { name: 'exit', target: 'exit', description: 'Exit to homepage' },
  { name: 'whoami', target: 'whoami', description: 'Print current user name' },
  { name: 'help', target: 'help', description: 'Show available commands' },
  { name: 'cd', target: 'cd', description: 'Change current directory' },
  { name: 'pwd', target: 'pwd', description: 'Print current directory' },
  { name: 'read', target: 'read', description: 'Open a blog post' },
];
