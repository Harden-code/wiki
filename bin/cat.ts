import type { CommandDefinition } from '../src/shell/types';
import { ok } from '../src/shell/shell';
import { readInput } from '../src/shell/input';

export const catCommand: CommandDefinition = {
  name: 'cat', description: 'Print file contents', usage: 'cat [file ...]',
  handler: (ctx, args) => ok(args.length ? args.map(file => readInput(ctx, file)).join('') : ctx.stdin),
};
