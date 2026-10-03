import type { CommandDefinition } from '../src/shell/types';
import { ok } from '../src/shell/shell';
import { lineArguments, readInput, splitLines } from '../src/shell/input';

export const headCommand: CommandDefinition = {
  name: 'head', description: 'Show first lines', usage: 'head [-n count] [file]',
  handler: (ctx, args) => {
    const { count, file } = lineArguments(args);
    return ok(splitLines(readInput(ctx, file)).slice(0, count).join('\n'));
  },
};
