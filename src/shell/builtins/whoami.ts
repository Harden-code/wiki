import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const whoamiCommand: CommandDefinition = {
  name: 'whoami',
  description: 'Print current user name',
  handler: () => ok('guest'),
};
