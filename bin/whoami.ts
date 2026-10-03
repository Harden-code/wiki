import type { CommandDefinition } from '../src/shell/types';
import { ok } from '../src/shell/shell';
import { homepage } from '../src/content/homepage';

export const whoamiCommand: CommandDefinition = {
  name: 'whoami',
  description: 'Print current user name',
  handler: () => ok(homepage.user),
};
