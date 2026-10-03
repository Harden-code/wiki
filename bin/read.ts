import type { CommandDefinition } from '../src/shell/types';
import { fail } from '../src/shell/shell';
import { normalizePath } from '../src/fs/path';

export const readCommand: CommandDefinition = {
  name: 'read', description: 'Open a Markdown article', usage: 'read <slug|path>',
  handler: (ctx, args) => {
    const target = args[0];
    if (!target || args.length > 1) return fail('Usage: read <slug|path>');
    const local = normalizePath(target, ctx.cwd);
    const slug = normalizePath(`/posts/${target.endsWith('.md') ? target : `${target}.md`}`);
    const content = ctx.fs.readFile(local) ?? ctx.fs.readFile(slug);
    if (content === null) return fail(`read: not found: ${target}`);
    return { stdout: content, exitCode: 0, ...(!ctx.piped ? { markdown: content } : {}) };
  },
};
