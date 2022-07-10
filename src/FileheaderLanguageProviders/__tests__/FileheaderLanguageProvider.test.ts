/**
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-07-02 17:56:16
 */
import vscode from "vscode";
import { expect } from "chai";
import sinon from "sinon";
import { closeAllEditors } from "../../tests/utils";
import { FileheaderLanguageProvider } from "../FileheaderLanguageProvider";

describe("FileheaderLanguageProvider", () => {
  describe("Static method `createCustomTemplate`", () => {
    it("Should show an error when it has no workspace", async () => {
      // const showErrorMessageProxy = sinon.spy(
      //   vscode.window,
      //   "showErrorMessage"
      // );
      // await closeAllEditors();
      // await FileheaderLanguageProvider.createCustomTemplate();
      // expect(
      //   showErrorMessageProxy.calledWith(
      //     "Fileheader Pro: Your workspace is not contain any folder"
      //   )
      // ).to.be.true;
    });
  });
});
