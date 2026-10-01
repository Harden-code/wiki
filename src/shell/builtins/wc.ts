import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const wcCommand: CommandDefinition = {
  name: 'wc',
  description: 'Count lines, words and bytes',
  usage: 'wc [file]',
  handler: (ctx, args) => {
    const file = args[0];
    const content = file ? ctx.fs.readFile(file.startsWith('/') ? file : `/posts/${file}.md`) ?? ctx.fs.readFile(file) : ctx.stdin;
    if (!content) return ok('0 0 0');
    const lines = content.split('\n').length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const bytes = new TextEncoder().encode(content).length;
    return ok(`${lines} ${words} ${bytes}`);
  },
};
