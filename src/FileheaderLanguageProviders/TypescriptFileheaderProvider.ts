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

  // TODO: support nested template tags
  override getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ) {
    return tpl`/*
* @author        ${variables.authorName} <${variables.authorEmail}>
* @date          ${variables.birthTime}
* @lastModified  ${variables.mtime}
* Copyright © ${variables.companyName} All rights reserved
*/`;
  }
}
