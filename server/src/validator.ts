import {
	Diagnostic,
	DiagnosticSeverity,
} from 'vscode-languageserver/node';

import { CharStream, CommonTokenStream, RecognitionException }  from 'antlr4';
import proglang12dLexer from './antlr/proglang12dLexer';
import proglang12dParser from './antlr/proglang12dParser';

class DiagnosticErrorListener {
	public diagnostics: Diagnostic[] = [];

	syntaxError(recognizer: any, offendingSymbol: any, line: number, column: number, msg: string, e: RecognitionException): void {
		this.diagnostics.push({
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: line - 1, character: column },
				end: { line: line - 1, character: column + 1 }
			},
			message: `Syntax Error: ${msg}`
		});
	}
}

export class Validator {

	static Validate(documentText: string): Diagnostic[] {
		const diagnostics: Diagnostic[] = [];

		try {
			const chars = new CharStream(documentText);
			const lexer = new proglang12dLexer(chars);
			const tokens = new CommonTokenStream(lexer);
			const parser = new proglang12dParser(tokens);

			// Set custom error listener
			const errorListener = new DiagnosticErrorListener();
			parser.removeErrorListeners();
			parser.addErrorListener(errorListener);

			// Try to parse the compilation unit
			parser.compilationUnit();

			return errorListener.diagnostics;
		} catch (error) {
			// Catch any unexpected errors during parsing
			console.error('Validation error:', error);
			if (diagnostics.length === 0) {
				diagnostics.push({
					severity: DiagnosticSeverity.Error,
					range: {
						start: { line: 0, character: 0 },
						end: { line: 0, character: 1 }
					},
					message: 'Unable to parse document'
				});
			}
			return diagnostics;
		}
	}

}
