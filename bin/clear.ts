import type { CommandDefinition } from '../src/shell/types';
export const clearCommand: CommandDefinition = {
  name: 'clear', description: 'Clear the terminal screen',
  handler: () => ({ stdout: '', exitCode: 0, clear: true }),
};
