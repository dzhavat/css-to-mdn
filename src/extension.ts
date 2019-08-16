import * as vscode from 'vscode';
import * as data from './properties.json';

interface Property {
	syntax: string;
	media: string | string[];
	inherited: boolean;
	animationType: string | string[];
	percentages: string | string[];
	groups: string[];
	initial: string | string[];
	appliesto: string;
	computed: string | string[];
	order: string;
	status: string;
	mdn_url?: string;
}

const properties: { [key: string]: Property } = data;

export function activate(context: vscode.ExtensionContext) {
	const hoverProvider: vscode.HoverProvider = {
		provideHover(doc, pos, token): vscode.ProviderResult<vscode.Hover> {
			const range = doc.getWordRangeAtPosition(pos, /[a-z\-]+:/ig);

			if (range === undefined) {
				return;
			}

			const mdnUrl = getUrl(doc.getText(range));

			if (mdnUrl === undefined) {
				return;
			}

			return new vscode.Hover(getText(mdnUrl));
		}
	};

	let disposable = vscode.languages.registerHoverProvider(
		[
			{ scheme: 'file', language: 'css' },
			{ scheme: 'file', language: 'less' },
			{ scheme: 'file', language: 'sass' },
			{ scheme: 'file', language: 'scss' }
		],
		hoverProvider
	);

	context.subscriptions.push(disposable);
}

function getUrl(word: string): string | undefined {
	return properties[word.substring(0, word.length - 1)].mdn_url;
}

function getText(url: string): vscode.MarkdownString {
	const text = `[Read more on MDN](${url})`;

	return new vscode.MarkdownString(text);
}

export function deactivate() {}
