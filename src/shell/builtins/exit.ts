import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const exitCommand: CommandDefinition = {
  name: 'exit',
  description: 'Exit to homepage',
  handler: () => ok('exit'),
};
