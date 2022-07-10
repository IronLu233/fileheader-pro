/**
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
import yargs from "yargs";
import rewire from "rewire";
import fs from "fs/promises";
export async function run() {
  // const templateModule = rewire(
  //   "../../FileheaderLanguageProviders/provider.template.js"
  // );
  // const templateContent = await fs.readFile(
  //   "../../FileheaderLanguageProviders/provider.template.js"
  // );
  // templateModule.__set__("default", templateContent);

  const argv = yargs(process.argv.slice(2)).argv as Record<string, string>;
  // Create the mocha test
  const mocha = new Mocha({
    ui: "bdd",
    color: true,
    timeout: 20 * 1000,
    slow: 10 * 1000,
    grep: argv.g,
  });
  const testsRoot = path.resolve(__dirname, "..", "..");

  return new Promise<void>((c, e) => {
    glob("**/**.test.js", { cwd: testsRoot }, (err, files) => {
      if (err) {
        return e(err);
      }

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      } catch (err) {
        console.error(err);
        e(err);
      }
    });
  });
}
