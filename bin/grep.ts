import type { CommandDefinition } from '../src/shell/types';
import { fail, ok } from '../src/shell/shell';
import { readInput, splitLines } from '../src/shell/input';

export const grepCommand: CommandDefinition = {
  name: 'grep', description: 'Filter lines by literal pattern', usage: 'grep <pattern> [file]',
  handler: (ctx, args) => {
    const pattern = args[0];
    if (pattern === undefined || args.length > 2) return fail('Usage: grep <pattern> [file]');
    const matches = splitLines(readInput(ctx, args[1])).filter(line => line.includes(pattern));
    return { stdout: matches.join('\n'), exitCode: matches.length ? 0 : 1 };
  },
};
