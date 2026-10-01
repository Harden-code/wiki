export type Token =
  | { type: 'word'; value: string }
  | { type: 'pipe' };

export function parseCommandLine(input: string): Token[] {
  const tokens: Token[] = [];
  let current = '';
  let quote: 'single' | 'double' | null = null;

  const pushWord = () => {
    if (current.length > 0) {
      tokens.push({ type: 'word', value: current });
      current = '';
    }
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (quote === 'single') {
      if (ch === "'") quote = null;
      else current += ch;
      continue;
    }

    if (quote === 'double') {
      if (ch === '"') quote = null;
      else current += ch;
      continue;
    }

    if (ch === ' ') {
      pushWord();
      continue;
    }

    if (ch === '|') {
      pushWord();
      tokens.push({ type: 'pipe' });
      continue;
    }

    if (ch === "'") {
      quote = 'single';
      continue;
    }

    if (ch === '"') {
      quote = 'double';
      continue;
    }

    current += ch;
  }

  pushWord();
  return tokens;
}

export function tokensToSegments(tokens: Token[]) {
  const segments: string[][] = [];
  let current: string[] = [];

  for (const token of tokens) {
    if (token.type === 'pipe') {
      if (current.length) segments.push(current);
      current = [];
      continue;
    }
    current.push(token.value);
  }

  if (current.length) segments.push(current);
  return segments;
}
