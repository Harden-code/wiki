import type { CommandDefinition } from '../src/shell/types';
import { fail, ok } from '../src/shell/shell';
import { normalizePath } from '../src/fs/path';

export const treeCommand: CommandDefinition = {
  name: 'tree',
  description: 'Show a directory tree',
  usage: 'tree [path]',
  handler: (ctx, args) => {
    const target = normalizePath(args[0] ?? ctx.cwd, ctx.cwd);
    if (!ctx.fs.exists(target)) return fail(`tree: no such file or directory: ${target}`);
    const lines: string[] = [target];

    const walk = (current: string, indent: string) => {
      const entries = ctx.fs.readDir(current);
      if (!entries) return;
      for (const entry of entries) {
        lines.push(`${indent}${entry.name}${entry.type === 'dir' ? '/' : ''}`);
        if (entry.type === 'dir') walk(normalizePath(`${current}/${entry.name}`), `${indent}  `);
      }
    };

    walk(target, '  ');
    return ok(lines.join('\n'));
  },
};
