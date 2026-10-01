export function normalizePath(input: string, cwd = '/') {
  const base = input.startsWith('/') ? input : joinPath(cwd, input);
  const parts = base.split('/');
  const stack: string[] = [];

  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }

  return '/' + stack.join('/');
}

export function joinPath(...parts: string[]) {
  const joined = parts.join('/').replace(/\/+/g, '/');
  if (!joined) return '/';
  return joined.startsWith('/') ? normalizePath(joined) : normalizePath(`/${joined}`);
}

export function dirname(path: string) {
  const normalized = normalizePath(path);
  if (normalized === '/') return '/';
  const parts = normalized.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/');
}

export function basename(path: string) {
  const normalized = normalizePath(path);
  if (normalized === '/') return '/';
  const parts = normalized.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '/';
}
