import vscode from 'vscode';
import crypto from 'crypto';
import { difference } from 'lodash';

class FileHashMemento {
  records: Map<string, string> = new Map();

  private calculate(source: string) {
    return crypto.createHash('sha1').update(source).digest('base64');
  }

  set(document: vscode.TextDocument) {
    const hash = this.calculate(document.getText());
    this.records.set(document.fileName, hash);
  }

  update(documents: vscode.TextDocument[]) {
    const originKeys = Array.from(this.records.keys());
    const newDocumentMap = new Map(documents.map(d => [d.fileName, d] as const));
    const newDocumentKey = Array.from(newDocumentMap.keys());
    const removedKeys = difference(originKeys, newDocumentKey);
    const newInsertKeys = difference(newDocumentKey, originKeys);
    
    removedKeys.forEach(key => this.records.delete(key));
    newInsertKeys.forEach(key => this.set(newDocumentMap.get(key)!));
  };

  remove(document: vscode.TextDocument) {
    this.records.delete(document.fileName);
  }

  has(document: vscode.TextDocument) {
    const originHash = this.records.get(document.fileName);

    if (!originHash) {
      return false;
    }
    return this.calculate(document.getText()) === originHash;
  }
  
}

/**
 * @singleton
 */
export const fileHashMemento = new FileHashMemento;
