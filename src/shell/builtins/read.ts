import type { CommandDefinition } from '../types';
import { fail, ok } from '../shell';
import { normalizePath } from '../../fs/path';
import { renderMarkdown } from '../../content/render';

export const readCommand: CommandDefinition = {
  name: 'read',
  description: 'Open a blog post',
  usage: 'read <slug|path>',
  handler: (ctx, args) => {
    const target = args[0];
    if (!target) return fail('Usage: read <slug|path>');
    const path = target.startsWith('/') ? normalizePath(target) : normalizePath(`/posts/${target}.md`, ctx.cwd);
    const content = ctx.fs.readFile(path) ?? ctx.fs.readFile(normalizePath(target, ctx.cwd));
    if (content === null) return fail(`read: not found: ${target}`);
    return ok(renderMarkdown(content));
  },
};
