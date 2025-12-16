/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import {
	Validator
} from './validator.js';

import {
	prototypesLoader
} from './prototypes.js';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true,
				triggerCharacters: ['.', '#']
			},
			// Tell the client that this server supports hover.
			hoverProvider: true
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	// Load prototypes asynchronously
	prototypesLoader.load().catch((error) => {
		connection.console.error(`Failed to load prototypes: ${error}`);
	});

	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders((_event) => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ServerSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ServerSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ServerSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ServerSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ServerSettings>(
			(change.settings.langServer || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ServerSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'langServer'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	const settings = await getDocumentSettings(textDocument.uri);
	
	const text = textDocument.getText();

	const diagnostics: Diagnostic[] = Validator.Validate(text);
	
	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// Get completions from loaded prototypes first
		const prototypeItems = prototypesLoader.getCompletionItems();
		
		// Combine with keyword completions
		const keywordItems: CompletionItem[] = [
			{
				label: 'if',
				kind: CompletionItemKind.Keyword,
				detail: 'Conditional statement',
				data: 1
			},
			{
				label: 'else',
				kind: CompletionItemKind.Keyword,
				detail: 'Else clause',
				data: 2
			},
			{
				label: 'while',
				kind: CompletionItemKind.Keyword,
				detail: 'While loop',
				data: 3
			},
			{
				label: 'for',
				kind: CompletionItemKind.Keyword,
				detail: 'For loop',
				data: 4
			},
			{
				label: 'return',
				kind: CompletionItemKind.Keyword,
				detail: 'Return statement',
				data: 5
			},
			{
				label: 'void',
				kind: CompletionItemKind.Keyword,
				detail: 'Void return type',
				data: 6
			},
			{
				label: 'int',
				kind: CompletionItemKind.Keyword,
				detail: 'Integer type',
				data: 7
			},
			{
				label: 'double',
				kind: CompletionItemKind.Keyword,
				detail: 'Double type',
				data: 8
			}
		];
		
		return [...keywordItems, ...prototypeItems];
	}
);

// This handler provides hover information for symbols.
connection.onHover(
	(textDocumentPositionParams) => {
		const textDocument = documents.get(textDocumentPositionParams.textDocument.uri);
		const word = getWordAtPosition(textDocument, textDocumentPositionParams.position);

		if (!word) {
			return null;
		}

		const prototype = prototypesLoader.getPrototype(word);
		if (prototype) {
			const documentation = prototypesLoader.getPrototypeSignature(word);
			return {
				contents: documentation || word
			};
		}

		return null;
	}
);

// Helper function to get word at position
function getWordAtPosition(textDocument: TextDocument | undefined, position: any): string | null {
	if (!textDocument) {
		return null;
	}

	const line = textDocument.getText().split('\n')[position.line];
	if (!line) {
		return null;
	}

	let start = position.character;
	let end = position.character;

	while (start > 0 && /[a-zA-Z0-9_]/.test(line[start - 1])) {
		start--;
	}

	while (end < line.length && /[a-zA-Z0-9_]/.test(line[end])) {
		end++;
	}

	return line.substring(start, end);
}

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			item.documentation = 'Conditional: if (condition) { ... }';
		} else if (item.data === 2) {
			item.documentation = 'Else clause: else { ... }';
		} else if (item.data === 3) {
			item.documentation = 'While loop: while (condition) { ... }';
		} else if (item.data === 4) {
			item.documentation = 'For loop: for (init; condition; increment) { ... }';
		} else if (item.data === 5) {
			item.documentation = 'Return from function: return value;';
		}
		return item;
	}
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
