// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function findClosingBracketMatchIndex(opening:string,closing:string,str: string | any[], pos:  number) {
	if (str[pos] !== opening) {
	  throw new Error(`No ${opening} at index ` + pos);
	}
	let depth = 1;
	for (let i = pos + 1; i < str.length; i++) {
	  switch (str[i]) {
	  case opening:
		depth++;
		break;
	  case closing:
		if (--depth === 0) {
		  return i;
		}
		break;
	  }
	}
	return -1;    // No matching closing parenthesis
  }
export function activate(context: vscode.ExtensionContext) {


	context.subscriptions.push(vscode.commands.registerCommand('early-return.earlyReturn', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the if statements selection within the selection
			const statements = document.getText(selection);
			let lastElse = statements.indexOf('else {');
			//get the opening bracket index
			let changedIfElse=statements
			if(lastElse>0){
				
				lastElse+=5;
				//find the last else enclosing bracket index
			const enclosingBracket = findClosingBracketMatchIndex('{','}',statements,lastElse);
			//replacing last else enclosing bracket with return;
			let removedLastBracket = statements.substring(0, enclosingBracket) + 'return;' + statements.substring(enclosingBracket+1);
		//replacing last else with return
		 changedIfElse = removedLastBracket.replace(/} else {/g, `return;}\n`);	
		}
		if(lastElse<=0){
			let lastIfElse =  statements.lastIndexOf('else if (')
			console.log("lastIfElse",lastIfElse);
			lastIfElse+=8
			let lastIfElsePracketIndex = findClosingBracketMatchIndex('(',')',statements,lastIfElse)
			 lastIfElsePracketIndex+=2
			let lastCurly = findClosingBracketMatchIndex('{','}',statements,lastIfElsePracketIndex)

			changedIfElse = statements.substring(0, lastCurly) + 'return;' + statements.substring(lastCurly+1);
			
			
		}
			
			//replacing all remaining else if with return
			changedIfElse = changedIfElse.replace(/} else/g, `return;}\n`);
			editor.edit(editBuilder => {
				editBuilder.replace(selection, changedIfElse);
			});
		}
	}));

}

// this method is called when your extension is deactivated
export function deactivate() {}
