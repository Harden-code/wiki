import { describe, expect, it } from 'vitest';
import { homepage, makeWelcome } from '../src/content/homepage';
import { makePrompt } from '../src/terminal/prompt';
import { BlogShell } from '../src/shell/runtime';

describe('homepage configuration and content files', () => {
  it('uses ASCII art on wide screens and a compact banner on narrow screens', () => {
    expect(makeWelcome(120)).toContain(homepage.banner.trimEnd());
    expect(makeWelcome(20)).toContain(homepage.compactBanner);
    expect(makeWelcome(20)).not.toContain(homepage.banner.trimEnd());
    expect(makeWelcome(120)).toContain(homepage.email);
  });
  it('shares the user and host between homepage, prompt and whoami', async () => {
    expect(makePrompt('/posts')).toBe(`${homepage.user}@${homepage.host}:/posts$ `);
    expect((await new BlogShell().run('whoami')).stdout).toBe(homepage.user);
  });
  it('bundles supported text files into /files', async () => {
    const shell = new BlogShell();
    expect((await shell.run('ls /files')).stdout).toContain('readme.txt');
    expect((await shell.run('cat /files/readme.txt')).stdout).toContain('不要放密码');
  });
});
