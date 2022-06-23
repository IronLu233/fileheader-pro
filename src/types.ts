import { Dayjs } from "dayjs";

export type ITemplateFunction = (
  strings: TemplateStringsArray,
  ...interpolations: any[]
) => [TemplateStringsArray, string[]];

export type IFileheaderVariables = {
  birthTime: string;

  /**
   * this field logic is not wonderful
   * may have some bugs
   * @experimental
   */
  mtime?: string;
  authorName: string;
  authorEmail: string;

  userName: string;
  userEmail: string;

  companyName?: string;
};
