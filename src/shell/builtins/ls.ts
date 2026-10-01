import type { CommandDefinition } from '../types';
import { ok } from '../shell';
import { normalizePath } from '../../fs/path';

export const lsCommand: CommandDefinition = {
  name: 'ls',
  description: 'List directory contents',
  usage: 'ls [path]',
  handler: (ctx, args) => {
    const target = normalizePath(args[0] ?? ctx.cwd, ctx.cwd);
    const entries = ctx.fs.readDir(target);
    if (!entries) return ok('');
    return ok(
      entries
        .map((entry) => {
          if (entry.type === 'command') return `*${entry.name}`;
          return entry.name + (entry.type === 'dir' ? '/' : '');
        })
        .join('  ')
    );
  },
};
