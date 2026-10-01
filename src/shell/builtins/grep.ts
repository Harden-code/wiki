import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const grepCommand: CommandDefinition = {
  name: 'grep',
  description: 'Filter lines by pattern',
  usage: 'grep <pattern> [file]',
  handler: (ctx, args) => {
    const pattern = args[0];
    if (!pattern) return ok('');
    const file = args[1];
    const content = file ? ctx.fs.readFile(file.startsWith('/') ? file : `/posts/${file}.md`) ?? ctx.fs.readFile(file) : ctx.stdin;
    if (!content) return ok('');
    return ok(content.split('\n').filter((line) => line.includes(pattern)).join('\n'));
  },
};
