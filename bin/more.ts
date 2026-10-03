import type { CommandDefinition } from '../src/shell/types';
import { readInput } from '../src/shell/input';
export const moreCommand: CommandDefinition = {
  name: 'more', description: 'Page through content', usage: 'more [file]',
  handler: (ctx, args) => ({ stdout: readInput(ctx, args[0]), exitCode: 0,
    ...(!ctx.piped ? { pager: 'more' as const } : {}) }),
};
