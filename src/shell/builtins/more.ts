import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const moreCommand: CommandDefinition = {
  name: 'more',
  description: 'Page through content',
  usage: 'more [file]',
  handler: (ctx, args) => {
    const file = args[0];
    const content = file ? ctx.fs.readFile(file.startsWith('/') ? file : `/posts/${file}.md`) ?? ctx.fs.readFile(file) : ctx.stdin;
    return ok(content ?? '');
  },
};
