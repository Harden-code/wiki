import type { CommandDefinition } from '../src/shell/types';
export const exitCommand: CommandDefinition = {
  name: 'exit', description: 'End this terminal session',
  handler: () => ({ stdout: '', exitCode: 0, exit: true }),
};
