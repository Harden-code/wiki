export type VfsNode =
  | { type: 'dir'; name: string; children: Map<string, VfsNode> }
  | { type: 'file'; name: string; content: string; mime?: string }
  | { type: 'command'; name: string; target: string; description?: string };

export class VirtualFileSystem {
  private readonly root: Extract<VfsNode, { type: 'dir' }> = { type: 'dir', name: '/', children: new Map() };

  constructor(
    seed: Array<{ path: string; content: string; mime?: string }> = [],
    commands: Array<{ name: string; target: string; description?: string }> = []
  ) {
    for (const item of seed) this.writeFile(item.path, item.content, item.mime);
    this.ensureDir('/bin');
    for (const cmd of commands) this.writeCommand(`/bin/${cmd.name}`, cmd.target, cmd.description);
  }

  ensureDir(path: string) {
    const parts = this.normalize(path).split('/').filter(Boolean);
    let node = this.root;
    for (const part of parts) {
      const existing = node.children.get(part);
      if (existing?.type === 'dir') {
        node = existing;
        continue;
      }
      const next: Extract<VfsNode, { type: 'dir' }> = { type: 'dir', name: part, children: new Map() };
      node.children.set(part, next);
      node = next;
    }
  }

  writeFile(path: string, content: string, mime?: string) {
    const normalized = this.normalize(path);
    const parts = normalized.split('/').filter(Boolean);
    let node = this.root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      const isLeaf = i === parts.length - 1;
      if (isLeaf) {
        node.children.set(part, { type: 'file', name: part, content, ...(mime ? { mime } : {}) });
        return;
      }

      const existing = node.children.get(part);
      if (existing?.type === 'dir') {
        node = existing;
        continue;
      }

      const next: Extract<VfsNode, { type: 'dir' }> = { type: 'dir', name: part, children: new Map() };
      node.children.set(part, next);
      node = next;
    }
  }

  writeCommand(path: string, target: string, description?: string) {
    const normalized = this.normalize(path);
    const parts = normalized.split('/').filter(Boolean);
    if (parts.length === 0) return;
    let node = this.root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      const isLeaf = i === parts.length - 1;
      if (isLeaf) {
        node.children.set(part, { type: 'command', name: part, target, ...(description ? { description } : {}) });
        return;
      }
      const existing = node.children.get(part);
      if (existing?.type === 'dir') {
        node = existing;
        continue;
      }
      const next: Extract<VfsNode, { type: 'dir' }> = { type: 'dir', name: part, children: new Map() };
      node.children.set(part, next);
      node = next;
    }
  }

  readFile(path: string) {
    const node = this.getNode(path);
    if (!node || node.type !== 'file') return null;
    return node.content;
  }

  readDir(path: string) {
    const node = this.getNode(path);
    if (!node || node.type !== 'dir') return null;
    return [...node.children.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  exists(path: string) {
    return this.getNode(path) !== null;
  }

  getCommandTarget(path: string) {
    const node = this.getNode(path);
    if (!node || node.type !== 'command') return null;
    return node.target;
  }

  private normalize(path: string) {
    if (path === '/') return '/';
    return '/' + path.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+/g, '/').replace(/\/+$/g, '');
  }

  private getNode(path: string) {
    const normalized = this.normalize(path);
    const parts = normalized.split('/').filter(Boolean);
    let node: VfsNode = this.root;

    if (parts.length === 0) return node;

    for (const part of parts) {
      if (node.type !== 'dir') return null;
      const next = node.children.get(part);
      if (!next) return null;
      node = next;
    }

    return node;
  }
}
