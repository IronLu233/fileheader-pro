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
import invariant from "invariant";
import { extensionConfigManager } from "../ExtensionConfigManager";
import { BaseVCSProvider } from "./BaseVCSProvider";
import { GitVCSProvider } from "./GitVCSProvider";

// eslint-disable-next-line @typescript-eslint/naming-convention
let VCSProvider: BaseVCSProvider = null as any;

// TODO: judge it from the workspace root
// eslint-disable-next-line @typescript-eslint/naming-convention
function VCSProviderFactory() {
  return new GitVCSProvider();
}

VCSProvider = VCSProviderFactory();
invariant(VCSProvider, "VCSProvider is not found.");

export { VCSProvider };
