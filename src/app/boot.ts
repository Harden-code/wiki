import { mountTerminal } from '../terminal/terminal';

export function bootApp(container: HTMLDivElement | null) {
  if (!container) return;

  container.innerHTML = '<div id="terminal-root" class="terminal-shell"></div>';
  const root = container.querySelector<HTMLElement>('#terminal-root');
  if (root) mountTerminal(root);
}
