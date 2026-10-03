import { homepage } from '../content/homepage';

export function makePrompt(cwd: string) {
  return `${homepage.user}@${homepage.host}:${cwd}$ `;
}
