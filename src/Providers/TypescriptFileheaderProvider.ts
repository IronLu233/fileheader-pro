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
    return tpl`${variables.author} <${variables.authorEmail}>`;
  }
}
