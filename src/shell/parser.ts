export type Token = { type: 'word'; value: string } | { type: 'pipe' };

export function parseCommandLine(input: string): Token[] {
  const tokens: Token[] = [];
  let current = '';
  let started = false;
  let quote: "'" | '"' | null = null;
  const pushWord = () => {
    if (started) tokens.push({ type: 'word', value: current });
    current = '';
    started = false;
  };
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if (ch === '\\' && quote !== "'") {
      const next = input[++i];
      if (next === undefined) throw new Error('syntax error: trailing escape');
      current += next;
      started = true;
    } else if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === "'" || ch === '"') {
      quote = ch;
      started = true;
    } else if (/\s/.test(ch)) {
      pushWord();
    } else if (ch === '|') {
      pushWord();
      tokens.push({ type: 'pipe' });
    } else {
      current += ch;
      started = true;
    }
  }
  if (quote) throw new Error('syntax error: unclosed quote');
  pushWord();
  return tokens;
}

export function tokensToSegments(tokens: Token[]): string[][] {
  const segments: string[][] = [];
  let current: string[] = [];
  for (const token of tokens) {
    if (token.type === 'pipe') {
      if (!current.length) throw new Error('syntax error: empty pipeline segment');
      segments.push(current);
      current = [];
    } else current.push(token.value);
  }
  if (tokens.length && !current.length) throw new Error('syntax error: trailing pipe');
  if (current.length) segments.push(current);
  return segments;
}
