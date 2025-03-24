import { Editor, MarkdownView, Plugin, Platform, Notice } from 'obsidian';

export default class DoubleRowToolbarPlugin extends Plugin {
	async onload() {

		if (Platform.isDesktop) {
			new Notice("'Double row toolbar' plugin is not supported on desktop devices.");
			return;
		}

		this.addCommand({
			id: "delete-current-line",
			name: "Delete current line",
			icon: "scissors-line-dashed",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.exec("deleteLine");
				editor.focus();
			}
		});
	}

	onunload() { }
}


