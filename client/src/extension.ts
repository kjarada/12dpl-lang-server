/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import * as cp from 'child_process';
import * as fs from 'fs';
import {
	commands,
	ExtensionContext,
	StatusBarAlignment,
	StatusBarItem,
	window,
	workspace
} from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	const outputChannel = window.createOutputChannel('12dPL Compiler');

	const compileCommandId = '12dpl.compile';
	context.subscriptions.push(
		commands.registerCommand(compileCommandId, async () => {
			if (process.platform !== 'win32') {
				void window.showErrorMessage('12dPL compiler is only supported on Windows (cc4d.exe).');
				return;
			}

			const editor = window.activeTextEditor;
			const document = editor?.document;

			if (!document || document.uri.scheme !== 'file') {
				void window.showInformationMessage('Open a .4dm file to compile.');
				return;
			}

			if (path.extname(document.fileName).toLowerCase() !== '.4dm') {
				void window.showInformationMessage('Open a .4dm file to compile.');
				return;
			}

			if (document.isDirty) {
				const saved = await document.save();
				if (!saved) {
					void window.showWarningMessage('Save the file before compiling.');
					return;
				}
			}

			const compilerExe = context.asAbsolutePath(path.join('compiler', 'cc4d.exe'));
			if (!fs.existsSync(compilerExe)) {
				void window.showErrorMessage(`Compiler not found: ${compilerExe}`);
				return;
			}

			const inputFile = document.fileName;
			const expectedOutput = inputFile.replace(/\.4dm$/i, '.4do');

			outputChannel.clear();
			outputChannel.appendLine(`> ${compilerExe} ${inputFile}`);
			outputChannel.show(true);

			const child = cp.spawn(compilerExe, [inputFile], {
				cwd: path.dirname(compilerExe),
				windowsHide: true
			});

			child.stdout.on('data', (data) => outputChannel.append(data.toString()));
			child.stderr.on('data', (data) => outputChannel.append(data.toString()));
			child.on('error', (err) => {
				outputChannel.appendLine(`\n[spawn error] ${String(err)}`);
				void window.showErrorMessage('Failed to start cc4d.exe. See Output: 12dPL Compiler.');
			});
			child.on('close', (code) => {
				outputChannel.appendLine(`\n[exit code] ${code ?? 'unknown'}`);
				if (code === 0) {
					if (fs.existsSync(expectedOutput)) {
						void window.showInformationMessage(`Compiled: ${expectedOutput}`);
					} else {
						void window.showWarningMessage('Compilation succeeded, but .4do was not found next to the input file.');
					}
				} else {
					void window.showErrorMessage('Compilation failed. See Output: 12dPL Compiler.');
				}
			});
		})
	);

	const playButton: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 100);
	playButton.text = '$(play) 12dPL';
	playButton.command = compileCommandId;
	playButton.tooltip = 'Compile current .4dm with cc4d';
	context.subscriptions.push(playButton);

	const updatePlayButtonVisibility = () => {
		const active = window.activeTextEditor?.document;
		const visible =
			!!active &&
			active.uri.scheme === 'file' &&
			path.extname(active.fileName).toLowerCase() === '.4dm';
		if (visible) {
			playButton.show();
		} else {
			playButton.hide();
		}
	};

	context.subscriptions.push(window.onDidChangeActiveTextEditor(updatePlayButtonVisibility));
	updatePlayButtonVisibility();

	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);


	//let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc//,
			//options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: '12dpl' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'12dpl-ls',
		'12d Programming Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
