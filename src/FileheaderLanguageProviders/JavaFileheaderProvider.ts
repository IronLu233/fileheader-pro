/**
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-19 11:06:08
 */
import { IFileheaderVariables, ITemplateFunction } from "../types";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";
export class JavaFileheaderProvider extends FileheaderLanguageProvider {
  readonly languages: string[] = ["java"];

  blockCommentStart: string = "/**";
  blockCommentEnd: string = "*/";

  override getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ) {
    const hasAuthor = variables.authorName;

    const authorLine =
      hasAuthor && tpl`\n * @author        ${variables.authorName}`;

    const birthtimeLine =
      variables.birthtime && tpl`\n * @date          ${variables.birthtime}`;

    const lastModifiedLine =
      variables.mtime && tpl`\n * @lastModified  ${variables.mtime}`;

    const companyNameLine =
      variables.companyName &&
      tpl`\n * Copyright © ${variables.companyName} All rights reserved`;

    // prettier-ignore
    return tpl
`/**${authorLine}${birthtimeLine}${lastModifiedLine}${companyNameLine}
 */`;

    // like this:
    /**
     * @author        ${variables.authorName}
     * @date          ${variables.birthtime}
     * @lastModified  ${variables.mtime}
     * Copyright © ${variables.companyName} All rights reserved
     */
  }
}
