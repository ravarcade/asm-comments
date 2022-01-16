import * as vscode from 'vscode';
import { markAsUntransferable } from 'worker_threads';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "asm-comm" is now active!');
	let disposable = vscode.commands.registerCommand('asm-comm.asmComments', () => {

		let columnWithComments: number = vscode.workspace.getConfiguration().get("asmComments.columnWithComments") ?? 40;
		let editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		let doc = editor.document;
		editor.edit(editBuilder => {
			for (var i = 0; i < doc.lineCount; i++) {
				var line = doc.lineAt(i);
				var colonX = line.text.indexOf(";");
				if (colonX && colonX > 0) {
					var comment = line.text.substring(colonX);
					if (comment.length > 1 && comment.substring(1, 2) !== " ") {
						comment = "; " + comment.substring(1);
					}
					var code = line.text.substring(0, colonX).trimEnd();
					if (code.length < columnWithComments - 1) {
						code += ' '.repeat(columnWithComments - code.length - 1);
					}
					var beg = new vscode.Position(i, 0);
					var end = new vscode.Position(i, line.range.end.character);
					var range = new vscode.Range(beg, end);
					var newLine = code + ' ' + comment;
					editBuilder.replace(range, newLine);
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
