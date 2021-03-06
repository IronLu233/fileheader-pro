/**
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-07-03 09:37:35
 */
import * as path from "path";

import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./unit/index");
    const TEST_WORKSPACE_DIR = path.resolve(
      __dirname,
      "..",
      "..",
      process.env.TEST_WORKSPACE_DIR!
    );

    // Download VS Code, unzip it and run the unit test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [TEST_WORKSPACE_DIR, "--disable-extensions"],
      extensionTestsEnv: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TEST_WORKSPACE_DIR,
      },
    });
  } catch (err) {
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
