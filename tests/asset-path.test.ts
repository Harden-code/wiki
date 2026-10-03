import { expect, it } from 'vitest';
import { resolveAssetPath } from '../src/content/asset-path';

it('prefixes root-relative Markdown assets for project Pages', () => {
  expect(resolveAssetPath('/images/avatar.png', '/wiki/')).toBe('/wiki/images/avatar.png');
  expect(resolveAssetPath('/files/resume.pdf', '/wiki/')).toBe('/wiki/files/resume.pdf');
  expect(resolveAssetPath('/wiki/files/resume.pdf', '/wiki/')).toBe('/wiki/files/resume.pdf');
  expect(resolveAssetPath('/images/avatar.png', '/')).toBe('/images/avatar.png');
});

it('preserves external, relative and anchor URLs', () => {
  for (const url of ['https://github.com/Harden-code', '//example.com/photo.png', 'mailto:you@example.com', '#notes', 'images/photo.png']) {
    expect(resolveAssetPath(url, '/wiki/')).toBe(url);
  }
});
