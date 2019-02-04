import { purify } from 'profanity-util';
import * as vscode from 'vscode';

export const purifyLogsHandler = () => {
  const {
    activeTextEditor: { document },
  } = vscode.window;

  const workspaceEdit = new vscode.WorkspaceEdit();

  const logs = getConsoleLogs(document);
  logs.forEach(
    log =>
      log.badWords &&
      workspaceEdit.replace(document.uri, log.range, log.purified)
  );

  const badWordsCount = logs.reduce(
    (prev, next) => prev + next.badWords,
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
  badWords: number;
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
      badWords: badWordsArray.length,
      range: matchRange,
    });
  }
  return logStatements;
};
