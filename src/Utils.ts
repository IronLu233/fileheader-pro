export function hasShebang(text: string): boolean {
  return text.startsWith("#!");
}

export function getTaggedTemplateInputs(
  strings: TemplateStringsArray,
  ...interpolations: any[]
): [TemplateStringsArray, any[]] {
  return [strings, interpolations];
}
