import type { CommandDefinition } from '../src/shell/types';
import { fail } from '../src/shell/shell';
import { normalizePath } from '../src/fs/path';

export const cdCommand: CommandDefinition = {
  name: 'cd', description: 'Change current directory', usage: 'cd [path]',
  handler: (ctx, args) => {
    if (args.length > 1) return fail('Usage: cd [path]');
    const target = args[0] ?? '/';
    const next = normalizePath(target, ctx.cwd);
    if (!ctx.fs.exists(next)) return fail(`cd: no such file or directory: ${target}`);
    if (ctx.fs.readDir(next) === null) return fail(`cd: not a directory: ${target}`);
    return { stdout: '', exitCode: 0, cwd: next };
  },
};
