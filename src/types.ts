import { Dayjs } from "dayjs";

export type ITemplateFunction = (
  strings: TemplateStringsArray,
  ...interpolations: any[]
) => [TemplateStringsArray, string[]];

export type IFileheaderVariables = {
  ctime: Dayjs;
  mtime: Dayjs;
  author: string;
  authorEmail: string;

  /**
   * @default 'YYYY-MM-DD HH:mm:ss'
   */
  dateFormat?: string;
};
