import type { CommandDefinition } from '../src/shell/types';

// Adding a *Command export to a module in bin automatically exposes it in /bin.
const modules = import.meta.glob<Record<string, unknown>>('./*.ts', { eager: true });
export const commands = Object.entries(modules)
  .filter(([path]) => path !== './index.ts')
  .flatMap(([, module]) => Object.entries(module)
    .filter(([name]) => name.endsWith('Command'))
    .map(([, command]) => command as CommandDefinition));
