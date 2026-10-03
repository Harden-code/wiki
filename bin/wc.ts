import type { CommandDefinition } from '../src/shell/types';
import { fail, ok } from '../src/shell/shell';
import { readInput } from '../src/shell/input';

export const wcCommand: CommandDefinition = {
  name: 'wc', description: 'Count newlines, words and UTF-8 bytes', usage: 'wc [file]',
  handler: (ctx, args) => {
    if (args.length > 1) return fail('Usage: wc [file]');
    const content = readInput(ctx, args[0]);
    const lines = (content.match(/\n/g) ?? []).length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    return ok(`${lines} ${words} ${new TextEncoder().encode(content).length}`);
  },
};
