import type { CommandDefinition } from '../types';
import { ok } from '../shell';
import { normalizePath } from '../../fs/path';

export const treeCommand: CommandDefinition = {
  name: 'tree',
  description: 'Show a directory tree',
  usage: 'tree [path]',
  handler: (ctx, args) => {
    const target = normalizePath(args[0] ?? ctx.cwd, ctx.cwd);
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
