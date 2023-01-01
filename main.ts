import { App, Modal, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface InvoiceGeneratorSettings {
	setting: string;
}

const DEFAULT_SETTINGS: InvoiceGeneratorSettings = {
	setting: 'default'
}

export default class InvoiceGenerator extends Plugin {
	settings: InvoiceGeneratorSettings;

	private readonly modal = new SampleModal(this.app);

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('dice', 'Test Invoice Generator', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new SampleModal(this.app).open();
		});


		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				this.modal.open();
			}
		});
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new InvoiceGeneratorSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		this.modal.close();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Invoice Generator');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class InvoiceGeneratorSettingTab extends PluginSettingTab {
	plugin: InvoiceGenerator;

	constructor(app: App, plugin: InvoiceGenerator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Invoice Generator.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.setting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.setting = value;
					await this.plugin.saveSettings();
				}));
	}
}
