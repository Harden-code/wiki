import type { CommandDefinition } from '../types';
import { ok } from '../shell';
import { normalizePath } from '../../fs/path';

function walk(fs: { readDir(path: string): Array<{ type: 'dir' | 'file'; name: string }> | null }, path: string, name: string, indent: string, lines: string[]) {
  lines.push(`${indent}${name}${name === '/' ? '' : ''}`);
  const entries = fs.readDir(path);
  if (!entries) return;
  for (const entry of entries) {
    const childPath = normalizePath(`${path}/${entry.name}`);
    lines.push(`${indent}  ${entry.name}${entry.type === 'dir' ? '/' : ''}`);
    if (entry.type === 'dir') walk(fs, childPath, entry.name, `${indent}  `, lines);
  }
}

export const findCommand: CommandDefinition = {
  name: 'find',
  description: 'Find files and directories',
  usage: 'find [path]',
  handler: (ctx, args) => {
    const target = normalizePath(args[0] ?? ctx.cwd, ctx.cwd);
    const lines: string[] = [target];
    const entries = ctx.fs.readDir(target);
    if (entries) {
      const recurse = (current: string) => {
        const items = ctx.fs.readDir(current);
        if (!items) return;
        for (const item of items) {
          const next = normalizePath(`${current}/${item.name}`);
          lines.push(next);
          if (item.type === 'dir') recurse(next);
        }
      };
      recurse(target);
    }
    return ok(lines.join('\n'));
  },
};
