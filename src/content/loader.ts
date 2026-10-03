export type PostMeta = {
  slug: string;
  title: string;
  date?: string;
  tags: string[];
  body: string;
};

const sources = import.meta.glob<string>('./posts/**/*.md', {
  eager: true, query: '?raw', import: 'default',
});

export function loadPosts(): PostMeta[] {
  return Object.entries(sources).map(([path, body]) => {
    const slug = path.replace('./posts/', '').replace(/\.md$/, '');
    const title = body.match(/^#\s+(.+)$/m)?.[1] ?? slug;
    return { slug, title, tags: [], body };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
}
