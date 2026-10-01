import { marked } from 'marked';

export function renderMarkdown(markdown: string) {
  return marked.parse(markdown, { async: false });
}
