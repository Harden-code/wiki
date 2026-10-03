import type { ShellResult } from './types';
import { normalizePath } from '../fs/path';
import { VirtualFileSystem } from '../fs/vfs';
import { seedFiles } from '../fs/seed';
import { commands } from '../../bin';
import { CommandRegistry, fail, ok } from './shell';
import { parseCommandLine, tokensToSegments } from './parser';

export class BlogShell {
  readonly fs: VirtualFileSystem;
  readonly registry = new CommandRegistry();
  cwd = '/';
  exited = false;

  constructor() {
    this.registry.registerMany(commands);
    this.fs = new VirtualFileSystem(seedFiles, this.registry.list().map(command => ({
      name: command.name, target: command.name, description: command.description,
    })));
  }

  async run(line: string): Promise<ShellResult> {
    if (this.exited) return fail('Session exited. Reload page to enter again.');
    try {
      const segments = tokensToSegments(parseCommandLine(line));
      let stdin = '';
      let result = ok();
      for (const segment of segments) {
        const [inputName, ...args] = segment;
        if (!inputName) continue;
        const name = inputName.includes('/')
          ? this.fs.getCommandTarget(normalizePath(inputName, this.cwd))
          : inputName;
        const command = name ? this.registry.get(name) : undefined;
        if (!command) return fail(`command not found: ${inputName}`, 127);
        result = await command.handler({
          cwd: this.cwd, argv: [inputName, ...args], stdin, fs: this.fs,
          commands: this.registry.list(), piped: segments.length > 1,
        }, args);
        if (result.exitCode) return result;
        if (result.cwd !== undefined) this.chdir(result.cwd);
        if (result.exit) this.exited = true;
        stdin = result.stdout;
      }
      return result;
    } catch (error) {
      return fail(error instanceof Error ? error.message : String(error), 2);
    }
  }

  chdir(target: string) {
    const next = normalizePath(target, this.cwd);
    if (this.fs.readDir(next) === null) throw new Error(`cd: not a directory: ${target}`);
    this.cwd = next;
  }
}
