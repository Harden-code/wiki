import type { CommandDefinition } from '../src/shell/types';
import { fail, ok } from '../src/shell/shell';
import { normalizePath } from '../src/fs/path';

export const findCommand: CommandDefinition = {
  name: 'find', description: 'Find files and directories', usage: 'find [path]',
  handler: (ctx, args) => {
    const target = normalizePath(args[0] ?? ctx.cwd, ctx.cwd);
    if (!ctx.fs.exists(target)) return fail(`find: no such file or directory: ${target}`);
    const lines: string[] = [];
    const walk = (path: string) => {
      lines.push(path);
      for (const entry of ctx.fs.readDir(path) ?? []) walk(normalizePath(`${path}/${entry.name}`));
    };
    walk(target);
    return ok(lines.join('\n'));
  },
};
