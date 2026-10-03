export type ShellContext = {
  cwd: string;
  argv: string[];
  stdin: string;
  piped: boolean;
  commands: CommandDefinition[];
  fs: {
    readFile(path: string): string | null;
    readDir(path: string): Array<{ type: 'dir' | 'file' | 'command'; name: string }> | null;
    exists(path: string): boolean;
    getCommandTarget?(path: string): string | null;
  };
};

export type ShellResult = {
  stdout: string;
  stderr?: string;
  exitCode?: number;
  cwd?: string;
  exit?: boolean;
  clear?: boolean;
  pager?: 'more' | 'less';
  markdown?: string;
};

export type CommandHandler = (ctx: ShellContext, args: string[]) => Promise<ShellResult> | ShellResult;

export type CommandDefinition = {
  name: string;
  description: string;
  usage?: string;
  handler: CommandHandler;
};
