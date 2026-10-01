import type { CommandDefinition } from '../types';
import { fail, ok } from '../shell';
import { normalizePath } from '../../fs/path';

export const catCommand: CommandDefinition = {
  name: 'cat',
  description: 'Print file contents',
  usage: 'cat <path>',
  handler: (ctx, args) => {
    const target = args[0] ?? '';
    if (!target) return fail('Usage: cat <path>');
    const path = target.startsWith('/') ? normalizePath(target) : normalizePath(target, ctx.cwd);
    const content = ctx.fs.readFile(path) ?? ctx.fs.readFile(normalizePath(`/posts/${target}.md`, ctx.cwd));
    if (content === null) return fail(`cat: no such file: ${target}`, 1);
    return ok(content);
  },
};
