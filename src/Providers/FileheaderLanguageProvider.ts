import { getTaggedTemplateInputs } from "../Utils";
import { IFileheaderVariables, ITemplateFunction } from "../types";

export abstract class FileheaderLanguageProvider {
  abstract languages: string[];

  startLineOffset = 0;

  abstract blockCommentStart: string;
  abstract blockCommentEnd: string;

  protected abstract getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ): [TemplateStringsArray, any[]];

  private getTemplateInternal(variables: IFileheaderVariables) {
    return this.getTemplate(getTaggedTemplateInputs, variables);
  }

  public getTemplateStrings(): string[] {
    return Array.from(this.getTemplateInternal({} as IFileheaderVariables)[0]);
  }

  public getFileheader(variables: IFileheaderVariables): string {
    const [strings, interpolations] = this.getTemplateInternal(variables);

    let fileheader = Array.from(strings).shift()!;
    for (let index = 0; index < interpolations.length; index++) {
      fileheader += interpolations[index] + strings[index];
    }

    return fileheader;
  }
}
