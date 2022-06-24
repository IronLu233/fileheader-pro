export type ITemplateFunction = (
  strings: TemplateStringsArray,
  ...interpolations: any[]
) => [TemplateStringsArray, string[]];

export type IFileheaderVariables = {
  birthTime: string;

  mtime?: string;
  authorName: string;
  authorEmail: string;

  userName: string;
  userEmail: string;

  companyName?: string;
};
