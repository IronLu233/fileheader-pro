/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-07-02 17:47:21
 */
import glob from "glob";
import Mocha from "mocha";
import path from "path";

// Create the mocha test
const mocha = new Mocha({
  ui: "bdd",
  color: true,
  timeout: 20 * 1000,
  slow: 10 * 1000,
});

const testsRoot = path.resolve(__dirname, "..");

glob.sync("**/__tests__/**.test.js", { cwd: testsRoot }).forEach((filePath) => {
  if (!filePath.includes("integration")) {
    mocha.addFile(path.resolve(testsRoot, filePath));
  }
  mocha.run((failures) => {
    if (failures > 0) {
      throw new Error(`${failures} tests failed.`);
    } else {
      return;
    }
  });
});
