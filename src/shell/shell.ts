import type { CommandDefinition, ShellResult } from './types';

export class CommandRegistry {
  private readonly commands = new Map<string, CommandDefinition>();

  register(command: CommandDefinition) {
    this.commands.set(command.name, command);
  }

  registerMany(commands: CommandDefinition[]) {
    commands.forEach((command) => this.register(command));
  }

  get(name: string) {
    return this.commands.get(name);
  }

  list() {
    return [...this.commands.values()].sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function ok(stdout = ''): ShellResult {
  return { stdout, exitCode: 0 };
}

export function fail(stderr: string, exitCode = 1): ShellResult {
  return { stdout: '', stderr, exitCode };
}
