import type { ShellContext } from './types';
import { normalizePath } from '../fs/path';

export function readInput(ctx: ShellContext, file?: string): string {
  if (file === undefined || file === '-') return ctx.stdin;
  const path = normalizePath(file, ctx.cwd);
  const content = ctx.fs.readFile(path);
  if (content !== null) return content;
  if (ctx.fs.readDir(path) !== null) throw new Error(`${ctx.argv[0]}: is a directory: ${file}`);
  throw new Error(`${ctx.argv[0]}: no such file: ${file}`);
}

export function splitLines(content: string): string[] {
  if (!content) return [];
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

export function lineArguments(args: string[]) {
  let count = 10;
  let file: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === '-n') {
      const value = args[++i];
      if (value === undefined || !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
        throw new Error('invalid line count: expected a non-negative integer');
      }
      count = Number(value);
    } else if (file !== undefined || (arg.startsWith('-') && arg !== '-')) {
      throw new Error('Usage: head/tail [-n count] [file]');
    } else file = arg;
  }
  return { count, file };
}
