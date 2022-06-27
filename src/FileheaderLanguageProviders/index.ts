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
import { PythonFileheaderProvider } from "./PythonFileheaderProvider";
import { TypescriptFileheaderProvider } from "./TypescriptFileheaderProvider";

export const internalProviders = [
  new TypescriptFileheaderProvider(),
  new PythonFileheaderProvider(),
];
