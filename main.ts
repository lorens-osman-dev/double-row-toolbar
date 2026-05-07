import { App, Editor, MarkdownView, Plugin, Platform, Notice, PluginSettingTab, Setting } from 'obsidian';

interface DoubleRowToolbarSettings {
	bottomOffset: number;
}

const DEFAULT_SETTINGS: DoubleRowToolbarSettings = {
	bottomOffset: 25
}

export default class DoubleRowToolbarPlugin extends Plugin {
	settings: DoubleRowToolbarSettings;

	async onload() {
		await this.loadSettings();

		if (Platform.isDesktop) {
			new Notice("'Double row toolbar' plugin is not supported on desktop devices.");
			return;
		}

		// Apply the stored setting immediately on load
		this.applyOffset();

		this.addCommand({
			id: "delete-current-line",
			name: "Delete current line",
			icon: "scissors-line-dashed",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.exec("deleteLine");
				editor.focus();
			}
		});

		this.addSettingTab(new DoubleRowToolbarSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.applyOffset();
	}

	// This updates the CSS variable you defined in styles.css
	applyOffset() {
		document.documentElement.style.setProperty('--double_row_mobile_toolbar_bottom_offset', `${this.settings.bottomOffset}px`);
	}

	onunload() {
		// Optional: Clean up the variable when plugin is disabled
		document.documentElement.style.removeProperty('--double_row_mobile_toolbar_bottom_offset');
	}
}

class DoubleRowToolbarSettingTab extends PluginSettingTab {
	plugin: DoubleRowToolbarPlugin;

	constructor(app: App, plugin: DoubleRowToolbarPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Double Row Toolbar Settings' });

		new Setting(containerEl)
			.setName('Bottom Offset')
			.setDesc('Adjust the distance from the bottom of the screen (Default: 25px).')
			.addSlider(slider => slider
				.setLimits(0, 100, 1) // Adjust range as needed
				.setValue(this.plugin.settings.bottomOffset)
				.onChange(async (value) => {
					this.plugin.settings.bottomOffset = value;
					await this.plugin.saveSettings();
				})
				.setDynamicTooltip()
			);
	}
}