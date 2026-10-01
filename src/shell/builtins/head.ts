import type { CommandDefinition } from '../types';
import { ok } from '../shell';

function takeLines(input: string, count: number) {
  return input.split('\n').slice(0, count).join('\n');
}

export const headCommand: CommandDefinition = {
  name: 'head',
  description: 'Show first lines',
  usage: 'head [-n count] [file]',
  handler: (ctx, args) => {
    const countIndex = args.indexOf('-n');
    const count = countIndex >= 0 ? Number(args[countIndex + 1] ?? '10') : 10;
    const filtered = args.filter((arg, index) => index !== countIndex && index !== countIndex + 1 && arg !== '-n');
    const file = filtered.length > 0 ? filtered[filtered.length - 1] : undefined;
    const content = file ? ctx.fs.readFile(file.startsWith('/') ? file : `/posts/${file}.md`) ?? ctx.fs.readFile(file) : ctx.stdin;
    if (!content) return ok('');
    return ok(takeLines(content, Number.isFinite(count) ? count : 10));
  },
};
