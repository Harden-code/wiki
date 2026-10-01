export function normalizeText(input: string) {
  return input.replace(/\r\n/g, '\n').trimEnd();
}
