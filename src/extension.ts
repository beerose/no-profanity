'use strict';
import * as vscode from 'vscode';

import { purifyLogsHandler } from './purifylogs';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.noProfanity',
    purifyLogsHandler
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
