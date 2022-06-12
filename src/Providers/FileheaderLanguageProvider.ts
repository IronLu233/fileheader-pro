import { getTaggedTemplateInputs } from "../Utils";
import { IFileheaderVariables, ITemplateFunction } from "../types";

export abstract class FileheaderLanguageProvider {
  abstract languages: string[];

  abstract getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ): [TemplateStringsArray, any[]];

  public getFileheader(variables: IFileheaderVariables): string {
    const [strings, interpolations] = this.getTemplate(
      getTaggedTemplateInputs,
      variables
    );

    let fileheader = Array.from(strings).shift()!;
    for (let index = 0; index < interpolations.length; index++) {
      fileheader += interpolations[index] + strings[index];
    }

    return fileheader;
  }
}
