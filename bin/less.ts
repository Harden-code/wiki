import type { CommandDefinition } from '../src/shell/types';
import { readInput } from '../src/shell/input';
export const lessCommand: CommandDefinition = {
  name: 'less', description: 'Page through content with backwards navigation', usage: 'less [file]',
  handler: (ctx, args) => ({ stdout: readInput(ctx, args[0]), exitCode: 0,
    ...(!ctx.piped ? { pager: 'less' as const } : {}) }),
};
