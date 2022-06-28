/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-26 17:10:03
 */
import { IFileheaderVariables, ITemplateFunction } from "../types";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";

export class PythonFileheaderProvider extends FileheaderLanguageProvider {
  languages: string[] = ["python"];

  blockCommentStart: string = "'''";
  blockCommentEnd: string = "'''";

  override getTemplate(tpl: ITemplateFunction, variables: IFileheaderVariables) {
    const authorEmailPart = variables.authorEmail && `<${variables.authorEmail}>`;
    const authorLine =
      variables.authorName && `\n@author        ${variables.authorName} ${authorEmailPart}`;
    const birthtimeLine = variables.birthtime && `\n@date          ${variables.birthtime}`;
    const lastModifiedLine = variables.mtime && `\n@lastModified  ${variables.mtime}`;
    const companyNameLine =
      variables.companyName && `\nCopyright © ${variables.companyName} All rights reserved`;

    // prettier-ignore
    return tpl
`'''${authorLine}${birthtimeLine}${lastModifiedLine}${companyNameLine}
'''`;
  }
}
