import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const clearCommand: CommandDefinition = {
  name: 'clear',
  description: 'Clear the terminal screen',
  handler: () => ok('\u001b[2J\u001b[H'),
};
