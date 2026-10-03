import type { CommandDefinition } from '../src/shell/types';
import { fail, ok } from '../src/shell/shell';

export const helpCommand: CommandDefinition = {
  name: 'help', description: 'Show available commands', usage: 'help [command]',
  handler: (ctx, args) => {
    if (args.length) {
      const command = ctx.commands.find(command => command.name === args[0]);
      return command ? ok(`${command.usage ?? command.name}\n${command.description}`) : fail(`help: unknown command: ${args[0]}`);
    }
    return ok(['terminal-blog commands:', ...ctx.commands.map(command =>
      `  ${command.name.padEnd(8)}${command.description}`), '',
    'Use /bin/<command> or <command>. Pipes: cat /help.md | grep help',
    'Pager: Space/Enter to advance, b to go back in less, q to quit.',
    `Current directory: ${ctx.cwd}`].join('\n'));
  },
};
