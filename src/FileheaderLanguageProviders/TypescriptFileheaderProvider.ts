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
  ): [TemplateStringsArray, any[]] {
    return tpl`/*
* @author        ${variables.authorName} <${variables.authorEmail}>
* @date          ${variables.ctime}
* ${
      variables.companyName
        ? `Copyright © ${variables.companyName} All rights reserved`
        : ""
    }
*/`;
  }
}
