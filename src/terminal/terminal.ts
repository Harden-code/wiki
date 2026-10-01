import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { terminalTheme } from './theme';
import { makePrompt } from './prompt';
import { BlogShell } from '../shell/runtime';

export function mountTerminal(container: HTMLElement) {
  const shell = new BlogShell();
  const term = new Terminal({
    convertEol: true,
    cursorBlink: true,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: 15,
    theme: terminalTheme,
  });
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(container);
  fitAddon.fit();

  let buffer = '';

  const print = (text: string) => term.write(text.replace(/\n/g, '\r\n'));
  const printPrompt = () => term.write(makePrompt(shell.cwd));

  print('Welcome to terminal-blog\n');
  print('Type `help` to see available commands.\n\n');
  printPrompt();

  term.onData(async (data) => {
    if (data === '\r') {
      const input = buffer;
      buffer = '';
      const result = await shell.run(input);
      if (result.stdout) print(`\r\n${result.stdout}`);
      if (result.stderr) print(`\r\n${result.stderr}`);
      if (shell.exited) {
        print('\r\nSession exited. Reload page to enter again.');
        return;
      }
      print('\r\n');
      printPrompt();
      return;
    }

    if (data === '\u007f') {
      if (buffer.length > 0) {
        buffer = buffer.slice(0, -1);
        term.write('\b \b');
      }
      return;
    }

    buffer += data;
    term.write(data);
  });

  window.addEventListener('resize', () => fitAddon.fit());
}
