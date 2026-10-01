import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const pwdCommand: CommandDefinition = {
  name: 'pwd',
  description: 'Print current directory',
  handler: (ctx) => ok(ctx.cwd),
};
