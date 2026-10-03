import type { CommandDefinition } from '../src/shell/types';
import { ok } from '../src/shell/shell';
import { lineArguments, readInput, splitLines } from '../src/shell/input';

export const tailCommand: CommandDefinition = {
  name: 'tail', description: 'Show last lines', usage: 'tail [-n count] [file]',
  handler: (ctx, args) => {
    const { count, file } = lineArguments(args);
    const lines = splitLines(readInput(ctx, file));
    return ok(count === 0 ? '' : lines.slice(-count).join('\n'));
  },
};
