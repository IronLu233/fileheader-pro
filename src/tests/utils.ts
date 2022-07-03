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
import {} from "proxyquire";
import { IFileheaderVariables } from "../types";
import { ConfigSection, CUSTOM_TEMPLATE_FILE_NAME } from "../constants";
import path from "path";

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

export async function copyCustomProvider(targetWorkspacePath: string) {
  await fs.copyFile(
    path.join(__dirname, "integration", "customProvider.template.js"),
    path.join(targetWorkspacePath, ".vscode", CUSTOM_TEMPLATE_FILE_NAME)
  );
  return path.join(targetWorkspacePath, ".vscode", CUSTOM_TEMPLATE_FILE_NAME);
}

export async function setDisableFields(
  disabledFields: (keyof IFileheaderVariables)[]
) {
  const config = vscode.workspace.getConfiguration();
  return config.update(ConfigSection.disableFields, disabledFields, false);
}
