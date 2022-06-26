import { IFileheaderVariables, ITemplateFunction } from "../types";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";

export class TypescriptFileheaderProvider extends FileheaderLanguageProvider {
  languages: string[] = [
    "typescript",
    "javascript",
    "javascriptreact",
    "typescriptreact",
  ];

  blockCommentStart: string = "/*";
  blockCommentEnd: string = "*/";

  override getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ) {
    // prettier-ignore
    return tpl
`/*
 * @author        ${variables.authorName} <${variables.authorEmail}>
 * @date          ${variables.birthtime}
 * @lastModified  ${variables.mtime}
 * Copyright © ${variables.companyName} All rights reserved
 */`;
  }
}
