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
			const range = doc.getWordRangeAtPosition(pos, /[a-z\-]+\s*:/ig);

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
		['css', 'less', 'sass', 'scss'],
		hoverProvider
	);

	context.subscriptions.push(disposable);
}

function getUrl(word: string): string | undefined {
	return properties[word.slice(0, -1).trim()].mdn_url;
}

function getText(url: string): vscode.MarkdownString {
	const text = `[Read more on MDN](${url})`;

	return new vscode.MarkdownString(text);
}

export function deactivate() {}
