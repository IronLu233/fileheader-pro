/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-07-02 17:10:50
 */
import { IFileheaderVariables, ITemplateFunction } from "../types";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";

export class CSSLanguageProvider extends FileheaderLanguageProvider {
  readonly languages: string[] = ["css", "less", "scss"];
  blockCommentStart: string = "/*";
  blockCommentEnd: string = "*/";

  override getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ) {
    const hasAuthor = variables.authorName;
    const authorEmailPart =
      !!variables.authorEmail && tpl`<${variables.authorEmail}>`;

    const authorLine =
      hasAuthor &&
      tpl`\n * @author        ${variables.authorName} ${authorEmailPart}`;

    const birthtimeLine =
      variables.birthtime && tpl`\n * @date          ${variables.birthtime}`;

    const lastModifiedLine =
      variables.mtime && tpl`\n * @lastModified  ${variables.mtime}`;

    const companyNameLine =
      variables.companyName &&
      tpl`\n * Copyright © ${variables.companyName} All rights reserved`;

    // prettier-ignore
    return tpl
`/*${authorLine}${birthtimeLine}${lastModifiedLine}${companyNameLine}
 */`;

    // like this:
    /*
     * @author        ${variables.authorName} <${variables.authorEmail}>
     * @date          ${variables.birthtime}
     * @lastModified  ${variables.mtime}
     * Copyright © ${variables.companyName} All rights reserved
     */
  }
}
