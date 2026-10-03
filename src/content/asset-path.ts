// Markdown uses site-root resource paths such as /images/avatar.png.
// Add the Vite deployment prefix without changing external URLs or virtual FS paths.
export function resolveAssetPath(url: string, base = import.meta.env.BASE_URL): string {
  if (!url.startsWith('/') || url.startsWith('//') || base === '/' || url.startsWith(base)) return url;
  return `${base}${url.slice(1)}`;
}
