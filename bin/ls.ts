import type { CommandDefinition } from '../src/shell/types';
import { fail, ok } from '../src/shell/shell';
import { normalizePath } from '../src/fs/path';

export const lsCommand: CommandDefinition = {
  name: 'ls',
  description: 'List directory contents',
  usage: 'ls [path]',
  handler: (ctx, args) => {
    const target = normalizePath(args[0] ?? ctx.cwd, ctx.cwd);
    const entries = ctx.fs.readDir(target);
    if (!entries) {
      if (!ctx.fs.exists(target)) return fail(`ls: no such file or directory: ${args[0]}`);
      return ok(target.split('/').pop() ?? target);
    }
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
