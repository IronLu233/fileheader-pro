import { TEMPLATE_SYMBOL_KEY } from "./constants";

export type TemplateInterpolation =
  | string
  | number
  | null
  | undefined
  | Template;

export type Template = {
  [TEMPLATE_SYMBOL_KEY]: true;
  strings: TemplateStringsArray;
  interpolations: TemplateInterpolation[];
};

export type ITemplateFunction = (
  strings: TemplateStringsArray,
  ...interpolations: TemplateInterpolation[]
) => Template;

export type IFileheaderVariables = {
  birthTime: string;

  mtime: string;
  authorName: string;
  authorEmail: string;

  userName: string;
  userEmail: string;

  companyName: string;
};
