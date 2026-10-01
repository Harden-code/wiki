import type { ShellResult } from './types';
import { normalizePath } from '../fs/path';
import { VirtualFileSystem } from '../fs/vfs';
import { seedFiles, commandSeeds } from '../fs/seed';
import { CommandRegistry, fail, ok } from './shell';
import { parseCommandLine, tokensToSegments } from './parser';
import { helpCommand } from './builtins/help';
import { clearCommand } from './builtins/clear';
import { lsCommand } from './builtins/ls';
import { catCommand } from './builtins/cat';
import { cdCommand } from './builtins/cd';
import { readCommand } from './builtins/read';
import { treeCommand } from './builtins/tree';
import { pwdCommand } from './builtins/pwd';
import { headCommand } from './builtins/head';
import { tailCommand } from './builtins/tail';
import { grepCommand } from './builtins/grep';
import { findCommand } from './builtins/find';
import { moreCommand } from './builtins/more';
import { lessCommand } from './builtins/less';
import { wcCommand } from './builtins/wc';
import { exitCommand } from './builtins/exit';
import { whoamiCommand } from './builtins/whoami';

export class BlogShell {
  readonly fs: VirtualFileSystem;
  readonly registry: CommandRegistry;
  cwd = '/';
  exited = false;

  constructor() {
    this.fs = new VirtualFileSystem(seedFiles, commandSeeds);
    this.registry = new CommandRegistry();
    this.registry.registerMany([
      helpCommand,
      clearCommand,
      lsCommand,
      catCommand,
      cdCommand,
      readCommand,
      treeCommand,
      pwdCommand,
      headCommand,
      tailCommand,
      grepCommand,
      findCommand,
      moreCommand,
      lessCommand,
      wcCommand,
      exitCommand,
      whoamiCommand,
    ]);
  }

  async run(line: string): Promise<ShellResult> {
    const tokens = parseCommandLine(line.trim());
    const segments = tokensToSegments(tokens);
    if (segments.length === 0) return ok('');

    let stdin = '';
    let result: ShellResult = ok('');

    for (const segment of segments) {
      const [name, ...args] = segment;
      if (!name) continue;
      const command = this.registry.get(name);
      if (!command) return fail(`command not found: ${name}`, 127);

      result = await command.handler({ cwd: this.cwd, argv: [name, ...args], stdin, fs: this.fs }, args);
      stdin = result.stdout;
      if (name === 'cd' && result.exitCode === 0 && result.stdout) this.cwd = normalizePath(result.stdout, this.cwd);
      if (name === 'exit' && result.exitCode === 0) this.exited = true;
      if (result.exitCode && result.exitCode !== 0) return result;
    }

    return result;
  }

  chdir(target: string) {
    this.cwd = normalizePath(target, this.cwd);
  }
}
