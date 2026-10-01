import type { CommandDefinition } from '../types';
import { ok } from '../shell';

export const helpCommand: CommandDefinition = {
  name: 'help',
  description: 'Show available commands',
  handler: (ctx) =>
    ok(
      [
        'terminal-blog commands:',
        '  help    Show this help',
        '  ls      List directory contents',
        '  cat     Print file contents',
        '  cd      Change current directory',
        '  pwd     Print current directory',
        '  tree    Show a directory tree',
        '  read    Open a blog post',
        '  head    Show first lines',
        '  tail    Show last lines',
        '  grep    Filter lines by pattern',
        '  find    Find files and directories',
        '  more    Page through content',
        '  less    Page through content',
        '  wc      Count lines, words and bytes',
        '  clear   Clear the terminal screen',
        '  exit    Exit to homepage',
        '  whoami  Print current user name',
        '',
        `Current directory: ${ctx.cwd}`,
      ].join('\n')
    ),
};
