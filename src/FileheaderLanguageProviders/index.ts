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
import { CSSLanguageProvider } from "./CSSFileheaderProvider";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";
import { HTMLFileheaderProvider } from "./HTMLFileheaderProvider";
import { JavaFileheaderProvider } from "./JavaFileheaderProvider";
import { PythonFileheaderProvider } from "./PythonFileheaderProvider";
import { TypescriptFileheaderProvider } from "./TypescriptFileheaderProvider";
import { VueFileheaderProvider } from "./VueFileheaderProvider";

export const internalProviders: FileheaderLanguageProvider[] = [
  new TypescriptFileheaderProvider(),
  new PythonFileheaderProvider(),
  new VueFileheaderProvider(),
  new HTMLFileheaderProvider(),
  new CSSLanguageProvider(),
  new JavaFileheaderProvider(),
];

export { FileheaderLanguageProvider };
