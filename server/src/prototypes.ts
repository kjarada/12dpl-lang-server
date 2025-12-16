import * as fs from 'fs';
import * as path from 'path';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver/node';
import { parseStringPromise } from 'xml2js';

export interface Parameter {
	Type: string[];
	Name: string[];
}

export interface MacroCall {
	Name: string[];
	LibraryID: string[];
	Return: Array<{ Type: string[] }>;
	Parameters: Array<{ Parameter?: Parameter[] }>;
}

export interface PrototypesData {
	MacroCalls: { MacroCall?: MacroCall[] };
}

class PrototypesLoader {
	private prototypes: Map<string, MacroCall> = new Map();
	private completionItems: CompletionItem[] = [];
	private loaded = false;

	async load(): Promise<void> {
		if (this.loaded) {
			return;
		}

		try {
			const prototypesPath = path.join(__dirname, 'resources', 'prototypes.xml');
			const xmlContent = fs.readFileSync(prototypesPath, 'utf-8');
			const parser = require('xml2js');
			const result = (await parser.parseStringPromise(xmlContent)) as PrototypesData;

			if (result.MacroCalls?.MacroCall) {
				result.MacroCalls.MacroCall.forEach((macro) => {
					const name = macro.Name[0];
					this.prototypes.set(name.toLowerCase(), macro);
					
					// Create completion item
					const returnType = macro.Return?.[0]?.Type?.[0] || 'void';
					const paramCount = macro.Parameters?.[0]?.Parameter?.length || 0;
					
					this.completionItems.push({
						label: name,
						kind: CompletionItemKind.Function,
						detail: `${returnType} ${name}(...)`,
						documentation: this.generateDocumentation(macro),
						data: name
					});
				});
			}

			this.loaded = true;
			console.log(`Loaded ${this.prototypes.size} prototypes from prototypes.xml`);
		} catch (error) {
			console.error('Error loading prototypes:', error);
			this.loaded = true; // Mark as loaded even on error to avoid retries
		}
	}

	private generateDocumentation(macro: MacroCall): string {
		const name = macro.Name[0];
		const returnType = macro.Return?.[0]?.Type?.[0] || 'void';
		const params = macro.Parameters?.[0]?.Parameter || [];

		let doc = `**Function**: ${name}\n\n`;
		doc += `**Return Type**: ${returnType}\n\n`;
		
		if (params.length > 0) {
			doc += `**Parameters**:\n`;
			params.forEach((param) => {
				const paramType = param.Type[0];
				const paramName = param.Name[0];
				doc += `- \`${paramType} ${paramName}\`\n`;
			});
		} else {
			doc += `**Parameters**: None\n`;
		}

		return doc;
	}

	getCompletionItems(): CompletionItem[] {
		return this.completionItems;
	}

	getPrototype(name: string): MacroCall | undefined {
		return this.prototypes.get(name.toLowerCase());
	}

	getPrototypeSignature(name: string): string | undefined {
		const macro = this.getPrototype(name);
		if (!macro) {
			return undefined;
		}

		const returnType = macro.Return?.[0]?.Type?.[0] || 'void';
		const params = macro.Parameters?.[0]?.Parameter || [];
		const paramStr = params
			.map((p) => `${p.Type[0]} ${p.Name[0]}`)
			.join(', ');

		return `${returnType} ${name}(${paramStr})`;
	}
}

export const prototypesLoader = new PrototypesLoader();
