import { describe, expect, it } from 'vitest';
import { BlogShell } from '../src/shell/runtime';
import { loadPosts } from '../src/content/loader';
import { VirtualFileSystem } from '../src/fs/vfs';

const names = ['ls', 'cat', 'head', 'tail', 'grep', 'find', 'tree', 'more', 'less', 'wc', 'clear', 'exit', 'whoami', 'help', 'cd', 'pwd', 'read'];

describe('README commands', () => {
  it('registers all 17 commands and executable /bin entries from one source', async () => {
    const shell = new BlogShell();
    expect(shell.registry.list().map(command => command.name).sort()).toEqual([...names].sort());
    expect(shell.fs.readDir('/bin')?.map(entry => entry.name).sort()).toEqual([...names].sort());
    expect((await shell.run('/bin/ls /posts')).stdout).toContain('hello-world.md');
    await shell.run('cd /bin');
    expect((await shell.run('./pwd')).stdout).toBe('/bin');
  });
  it.each(['help', 'ls /bin', 'ls /posts', 'cat /about.md', 'head /about.md', 'tail /about.md', 'grep blog /help.md', 'find /', 'tree /', 'more /help.md', 'less /help.md', 'wc /help.md', 'whoami', 'read hello-world', 'exit'])('runs README example: %s', async line => {
    expect((await new BlogShell().run(line)).exitCode).toBe(0);
  });
  it('cd changes cwd silently and rejects files', async () => {
    const shell = new BlogShell();
    expect(await shell.run('cd /posts')).toMatchObject({ stdout: '', cwd: '/posts' });
    expect((await shell.run('pwd')).stdout).toBe('/posts');
    expect((await shell.run('cat hello-world.md')).stdout).toContain('欢迎');
    expect((await shell.run('cd hello-world.md')).exitCode).not.toBe(0);
    expect(shell.cwd).toBe('/posts');
    await shell.run('cd ..');
    expect(shell.cwd).toBe('/');
  });
  it('head/tail accept file parameters, counts and stdin', async () => {
    const shell = new BlogShell();
    shell.fs.writeFile('/sample', 'one\ntwo\nthree\n');
    expect((await shell.run('head -n 1 /sample')).stdout).toBe('one');
    expect((await shell.run('tail /sample -n 1')).stdout).toBe('three');
    expect((await shell.run('cat /sample | head -n 2 | tail -n 1')).stdout).toBe('two');
    expect((await shell.run('tail -n 0 /sample')).stdout).toBe('');
    for (const line of ['head -n', 'tail -n -1', 'head -n 1.5', 'head -n nope']) {
      expect((await shell.run(line)).exitCode).not.toBe(0);
    }
  });
  it.each(['cat', 'head', 'tail', 'wc', 'more', 'less', 'ls', 'tree', 'find', 'read'])('%s reports missing paths', async name => {
    expect((await new BlogShell().run(`${name} /missing`)).exitCode).not.toBe(0);
  });
  it('all text commands use cwd; empty files are not missing', async () => {
    const shell = new BlogShell();
    shell.fs.writeFile('/posts/sample', 'alpha\nbeta\n');
    shell.fs.writeFile('/posts/empty', '');
    await shell.run('cd /posts');
    for (const name of ['cat', 'head', 'tail', 'more', 'less']) {
      expect((await shell.run(`${name} sample`)).stdout).toContain('alpha');
      expect((await shell.run(`${name} empty`)).exitCode).toBe(0);
    }
    expect((await shell.run('grep beta sample')).stdout).toBe('beta');
    expect((await shell.run('wc sample')).stdout).toBe('2 2 11');
    expect((await shell.run('wc empty')).stdout).toBe('0 0 0');
    expect((await shell.run('grep "" sample')).stdout).toBe('alpha\nbeta');
    expect((await shell.run('grep missing sample')).exitCode).toBe(1);
  });
  it('preserves quotes, escapes and tabs; rejects malformed pipelines', async () => {
    const shell = new BlogShell();
    shell.fs.writeFile('/space name', 'hello world\n');
    expect((await shell.run('cat\t"/space name" | grep "hello world"')).stdout).toBe('hello world');
    expect((await shell.run('cat /space\\ name')).stdout).toBe('hello world\n');
    for (const line of ['| ls', 'ls |', 'ls || cat', 'cat "oops', 'cat \\']) {
      expect((await shell.run(line)).exitCode).toBe(2);
    }
    expect((await shell.run('does-not-exist')).exitCode).toBe(127);
  });
  it('loads actual Markdown sources and pipes raw Markdown', async () => {
    const shell = new BlogShell();
    expect(loadPosts().length).toBeGreaterThan(0);
    expect((await shell.run('read hello-world')).markdown).toContain('欢迎');
    const result = await shell.run('read hello-world | head -n 1');
    expect(result.stdout).toBe('# Hello World');
    expect(result.markdown).toBeUndefined();
  });
  it('signals pager, clear and exit without output escape sequences', async () => {
    const shell = new BlogShell();
    expect((await shell.run('less /help.md')).pager).toBe('less');
    expect((await shell.run('less /help.md | wc')).pager).toBeUndefined();
    expect(await shell.run('/bin/clear')).toMatchObject({ stdout: '', clear: true });
    await shell.run('/bin/exit');
    expect(shell.exited).toBe(true);
    expect((await shell.run('pwd')).exitCode).not.toBe(0);
  });
});

describe('virtual filesystem', () => {
  it('normalizes dot segments and protects files from implicit directory replacement', () => {
    const fs = new VirtualFileSystem([{ path: '/a/file', content: 'value' }]);
    expect(fs.readFile('/a/../a/./file')).toBe('value');
    expect(() => fs.ensureDir('/a/file/child')).toThrow('not a directory');
    expect(() => fs.writeFile('/a/file/child', 'bad')).toThrow('not a directory');
    expect(() => fs.writeCommand('/a/file/cmd', 'pwd')).toThrow('not a directory');
    expect(fs.readFile('/a/file')).toBe('value');
  });
});
