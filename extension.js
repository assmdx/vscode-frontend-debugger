const vscode = require('vscode');
const UglifyJS = require('uglify-js');


/**
 * @param {vscode.ExtensionContext} context
/**
 *
 *
 * @param {*} context
 */
function activate(context) {

	/**
	 *
	 * parse variables in code.
	 * @param {string} codeStr
	 * @returns
	 */
	function parseParams(codeStr) {
		let parsed = UglifyJS.parse(codeStr);
		parsed.figure_out_scope();
		let arr = [];
		parsed.globals.each(function(g) {
			arr.push({
				name:g.name
			});
		});
		return arr;
	}
	
	/**
	 *
	 * insert console debug code into source code.
	 * @param {*} textEditor
	 * @param {*} textEditorEdit
	 * @returns
	 */
	function insertConsole(textEditor, textEditorEdit) {
		try {
			if (typeof textEditor._selections[0]._start._line === "number") {
				let lineNowAt = textEditor._selections[0]._start._line;	
				// let character = textEditor._selections[0]._start._character;	
				let codeStr = textEditor._documentData._lines[lineNowAt];
				let paramsArr = parseParams(codeStr);

				let consoleStr = '';
				paramsArr.forEach(v => {
					consoleStr += `console.log('${v.name}: ', ${v.name});`
				})
				consoleStr = consoleStr + '\n';
				textEditorEdit.insert(new vscode.Position(lineNowAt + 1,0), consoleStr);
			}
		} catch(err) {
			vscode.window.showInformationMessage('Warning, this line can not be debuged!');
			console.error(err);
			return ;
		}		
	}

	let d  = vscode.commands.registerTextEditorCommand('extension.frontend-debugger', insertConsole);
	vscode.commands.reg
	context.subscriptions.push(d);
}

exports.activate = activate;

function deactivate() {
}





module.exports = {
	activate,
	deactivate
}

//smmsrg4urwehmtdjtshgettwvbmx4flzr5a3jdibdvf7qyy63laa