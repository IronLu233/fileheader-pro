/*
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
export { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";
import { CSSLanguageProvider } from "./CSSFileheaderProvider";
import { HTMLFileheaderProvider } from "./HTMLFileheaderProvider";
import { PythonFileheaderProvider } from "./PythonFileheaderProvider";
import { TypescriptFileheaderProvider } from "./TypescriptFileheaderProvider";
// import { VueFileheaderProvider } from "./VueFileheaderProvider";

export const internalProviders = [
  new TypescriptFileheaderProvider(),
  new PythonFileheaderProvider(),
  // new VueFileheaderProvider(), we may need register a dummy .vue language id
  new HTMLFileheaderProvider(),
  new CSSLanguageProvider(),
];
