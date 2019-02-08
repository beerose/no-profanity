'use strict';
import * as vscode from 'vscode';

import { purifyLogs } from './purifylogs';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.noProfanity',
    purifyLogs
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
