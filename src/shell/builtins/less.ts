import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const lessCommand: CommandDefinition = {
  name: 'less',
  description: 'Page through content',
  usage: 'less [file]',
  handler: (ctx, args) => {
    const file = args[0];
    const content = file ? ctx.fs.readFile(file.startsWith('/') ? file : `/posts/${file}.md`) ?? ctx.fs.readFile(file) : ctx.stdin;
    return ok(content ?? '');
  },
};
