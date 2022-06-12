import { IFileheaderVariables, ITemplateFunction } from "../types";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";

export class TypescriptFileheaderProvider extends FileheaderLanguageProvider {
  override getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ): [TemplateStringsArray, any[]] {
    return tpl`${variables.author} <${variables.authorEmail}>`;
  }

  languages: string[] = [
    "typescript",
    "javascript",
    "javascriptreact",
    "typescriptreact",
  ];
}
