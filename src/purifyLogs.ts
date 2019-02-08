import { purify } from 'profanity-util';
import * as vscode from 'vscode';

export const purifyLogs = () => {
  const {
    activeTextEditor: { document },
  } = vscode.window;

  const workspaceEdit = new vscode.WorkspaceEdit();

  const logs = getConsoleLogs(document);
  logs
    .filter(log => log.badWordsCount > 0)
    .forEach(log => {
      workspaceEdit.replace(document.uri, log.range, log.purified);
    });

  const badWordsCount = logs.reduce(
    (sum, log) => sum + log.badWordsCount,
    0
  );

  vscode.workspace.applyEdit(workspaceEdit).then(() => {
    badWordsCount
      ? vscode.window.showInformationMessage(
          `Number of bad words that were censored: ${badWordsCount} 🤬🤬🤬🤬`
        )
      : vscode.window.showInformationMessage(
          'No bad words! 😇😇😇😇'
        );
    document.save();
  });
};

const logRegex = /console\s*\.\s*log\([\s\S]*?\);/g;

const getConsoleLogs = (
  document: vscode.TextDocument
): Array<{
  range: vscode.Range;
  purified: string;
  badWordsCount: number;
}> => {
  const documentText = document.getText();
  let logStatements = [];

  let match;
  while ((match = logRegex.exec(documentText))) {
    const matchRange = new vscode.Range(
      document.positionAt(match.index),
      document.positionAt(match.index + match[0].length)
    );
    const [purified, badWordsArray] = purify(match[0]);
    logStatements.push({
      purified,
      badWordsCount: badWordsArray.length,
      range: matchRange,
    });
  }
  return logStatements;
};
