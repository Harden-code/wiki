import type { CommandDefinition } from '../types';
import { fail, ok } from '../shell';
import { normalizePath } from '../../fs/path';

export const cdCommand: CommandDefinition = {
  name: 'cd',
  description: 'Change current directory',
  usage: 'cd <path>',
  handler: (ctx, args) => {
    const target = args[0];
    if (!target) return fail('Usage: cd <path>');
    const next = normalizePath(target, ctx.cwd);
    if (!ctx.fs.exists(next)) return fail(`cd: no such file or directory: ${target}`);
    return ok('');
  },
};
