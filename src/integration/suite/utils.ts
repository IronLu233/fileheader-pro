/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-30 22:31:52
 */

// this file is for extension integration test utilities
import vscode from "vscode";
import fs from "fs/promises";
import sinon from "sinon";

export async function closeAllEditors() {
  for (let _ of vscode.workspace.textDocuments) {
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
  }
}

export async function createAndShowDocument(filePath: string, content = "") {
  await fs.writeFile(filePath, content);
  const document = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(document);
  return document;
}
