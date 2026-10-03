import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { terminalTheme } from './theme';
import { makePrompt } from './prompt';
import { BlogShell } from '../shell/runtime';
import { renderMarkdown } from '../content/render';
import { makeWelcome } from '../content/homepage';

export function mountTerminal(container: HTMLElement) {
  const shell = new BlogShell();
  const term = new Terminal({
    convertEol: true, cursorBlink: true,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: 15, theme: terminalTheme,
  });
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(container);
  fitAddon.fit();
  term.focus();
  let buffer = '';
  let busy = false;
  let historyIndex = 0;
  const history: string[] = [];
  let pager: { mode: 'more' | 'less'; lines: string[]; offset: number } | null = null;
  let article: HTMLDialogElement | null = null;
  const print = (text: string) => term.write(text);
  const prompt = () => print(makePrompt(shell.cwd));
  const redraw = () => { print('\r\u001b[2K'); prompt(); print(buffer); };
  const endPager = () => {
    pager = null;
    print('\u001b[?1049l');
    prompt();
  };
  const showPage = () => {
    if (!pager) return;
    const height = Math.max(1, term.rows - 1);
    print('\u001b[2J\u001b[H');
    print(pager.lines.slice(pager.offset, pager.offset + height).join('\n'));
    print(`\r\n\u001b[7m--${pager.mode}-- ${pager.offset + 1}/${pager.lines.length} (Space/Enter, b, q)\u001b[0m`);
  };
  const openArticle = (markdown: string) => {
    article = document.createElement('dialog');
    article.className = 'article-dialog';
    const close = document.createElement('button');
    close.textContent = '关闭 / Close';
    close.addEventListener('click', () => article?.close());
    const body = document.createElement('article');
    body.innerHTML = renderMarkdown(markdown);
    body.querySelectorAll('a').forEach(link => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    article.append(close, body);
    document.body.append(article);
    article.addEventListener('close', () => {
      article?.remove();
      article = null;
      term.focus();
    }, { once: true });
    article.showModal();
  };

  print(makeWelcome(term.cols));
  prompt();
  term.onData(async data => {
    if (busy || shell.exited || article) return;
    if (pager) {
      if (data === 'q' || data === '\u0003') { endPager(); return; }
      if (data === 'b' && pager.mode === 'less') {
        pager.offset = Math.max(0, pager.offset - Math.max(1, term.rows - 1));
      } else if (data === ' ' || data === '\r') {
        const next = pager.offset + (data === '\r' ? 1 : Math.max(1, term.rows - 1));
        if (next >= pager.lines.length) { endPager(); return; }
        pager.offset = next;
      } else return;
      showPage();
      return;
    }
    if (data === '\r') {
      busy = true;
      const input = buffer;
      buffer = '';
      if (input.trim()) history.push(input);
      historyIndex = history.length;
      print('\r\n');
      try {
        const result = await shell.run(input);
        if (result.clear) term.clear();
        if (result.markdown !== undefined) {
          openArticle(result.markdown);
        } else if (result.pager && result.stdout) {
          pager = { mode: result.pager, lines: result.stdout.split('\n'), offset: 0 };
          print('\u001b[?1049h');
          showPage();
          return;
        } else if (result.stdout) print(`${result.stdout}\r\n`);
        if (result.stderr) print(`${result.stderr}\r\n`);
        if (shell.exited) { print('Session exited. Reload page to enter again.\r\n'); return; }
        prompt();
      } finally { busy = false; }
      return;
    }
    if (data === '\u0003') { buffer = ''; print('^C\r\n'); prompt(); return; }
    if (data === '\u007f') {
      const chars = Array.from(buffer);
      chars.pop();
      buffer = chars.join('');
      redraw();
      return;
    }
    if (data === '\u001b[A' || data === '\u001b[B') {
      historyIndex = Math.max(0, Math.min(history.length, historyIndex + (data === '\u001b[A' ? -1 : 1)));
      buffer = history[historyIndex] ?? '';
      redraw();
      return;
    }
    // Ignore unsupported control sequences; pasted newlines must not execute commands.
    const text = data.replace(/\u001b\[[0-9;?]*[A-Za-z~]/g, '')
      .replace(/[\r\n\t]/g, ' ').replace(/[\x00-\x1f\x7f]/g, '');
    buffer += text;
    print(text);
  });
  const observer = new ResizeObserver(() => {
    fitAddon.fit();
    if (pager) showPage();
  });
  observer.observe(container);
  return () => {
    observer.disconnect();
    article?.remove();
    term.dispose();
  };
}
