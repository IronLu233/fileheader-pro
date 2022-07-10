/**
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-12 22:33:53
 */
import { TEMPLATE_SYMBOL_KEY } from "./constants";

export type TemplateInterpolation =
  | string
  | number
  | null
  | undefined
  | boolean
  | Template;

export type Template = {
  [TEMPLATE_SYMBOL_KEY]: true;
  strings: TemplateStringsArray;
  interpolations: TemplateInterpolation[];
};

export type ITemplateFunction = (
  strings: TemplateStringsArray,
  ...interpolations: TemplateInterpolation[]
) => Template;

/**
 * Fileheader variables
 * some fields are inspired by https://www.jetbrains.com/help/idea/file-template-variables.html
 */
export type IFileheaderVariables = {
  /**
   * file birth time
   * will get it from VCS or fallback to filesystem when it is not available
   */
  birthtime?: string;

  /**
   * file modified time
   * will get it from VCS or fallback to filesystem when it is not available
   */
  mtime?: string;

  /**
   * if the file is tracked by VCS, it will get the author name from VCS
   * else it will get it from current user name
   */
  authorName?: string;

  /**
   * if the file is tracked by VCS, it will get the author email from VCS
   * else it will get it from current user email
   */
  authorEmail?: string;

  /**
   * user name is from VSCode config, and fallback to VCS config
   */
  userName?: string;

  /**
   * user email is from VSCode config, and fallback to VCS config
   */
  userEmail?: string;

  companyName?: string;

  /**
   * name of current project
   */
  projectName?: string;

  /**
   * the file path, relative to project root
   * POSIX path separator
   */
  filePath?: string;

  /**
   * the directory path, relative to project root
   * POSIX path separator
   */
  dirPath?: string;

  /**
   * filename including extension
   */
  fileName?: string;
};
