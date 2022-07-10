/**
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-24 10:23:35
 */
import vscode from "vscode";
import { difference } from "lodash-es";
import { getStringHash } from "./Utils";

class FileHashMemento {
  records: Map<string, string> = new Map();

  private calculate(source: string) {
    return getStringHash(source);
  }

  set(document: vscode.TextDocument) {
    const hash = this.calculate(document.getText());
    this.records.set(document.fileName, hash);
  }

  update(documents: vscode.TextDocument[]) {
    const originKeys = Array.from(this.records.keys());
    const newDocumentMap = new Map(
      documents.map((d) => [d.fileName, d] as const)
    );
    const newDocumentKey = Array.from(newDocumentMap.keys());
    const removedKeys = difference(originKeys, newDocumentKey);
    const newInsertKeys = difference(newDocumentKey, originKeys);

    removedKeys.forEach((key) => this.records.delete(key));
    newInsertKeys.forEach((key) => this.set(newDocumentMap.get(key)!));
  }

  remove(document: vscode.TextDocument) {
    this.records.delete(document.fileName);
  }

  has(document: vscode.TextDocument, skipCheckHash = false) {
    const originHash = this.records.get(document.fileName);

    if (!originHash) {
      return false;
    }
    return skipCheckHash || this.calculate(document.getText()) === originHash;
  }
}

/**
 * @singleton
 */
export const fileHashMemento = new FileHashMemento();
