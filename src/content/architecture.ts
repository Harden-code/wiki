export const asciiArchitecture = String.raw`
  ┌───────────────────────────────────────────────────────────┐
  │                    terminal-blog                            │
  └───────────────────────────────────────────────────────────┘
        │
        ├── UI Layer
        │     ├── xterm.js terminal
        │     ├── prompt / theme / renderer
        │     └── mobile-friendly container
        │
        ├── Shell Layer
        │     ├── command parser
        │     ├── command registry
        │     ├── history / pipes / autocompletion
        │     └── built-in commands (help, ls, cat, read...)
        │
        ├── Virtual FS Layer
        │     ├── path normalization
        │     ├── directories / files
        │     └── seeded content tree
        │
        └── Content Layer
              ├── Markdown posts
              ├── metadata and tags
              └── blog-specific pages
`;
