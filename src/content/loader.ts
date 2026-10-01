export type PostMeta = {
  slug: string;
  title: string;
  date?: string;
  tags: string[];
  body: string;
};

export function loadPosts() {
  return [] as PostMeta[];
}
