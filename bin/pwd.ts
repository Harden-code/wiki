import type { CommandDefinition } from '../src/shell/types';
import { ok } from '../src/shell/shell';

export const pwdCommand: CommandDefinition = {
  name: 'pwd',
  description: 'Print current directory',
  handler: (ctx) => ok(ctx.cwd),
};
