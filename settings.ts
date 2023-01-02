import InvoiceGenerator from "./main";
import {App, PluginSettingTab, Setting} from "obsidian";

export class InvoiceGeneratorSettingTab extends PluginSettingTab {
	plugin: InvoiceGenerator;

	constructor(app: App, plugin: InvoiceGenerator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Invoice Folder Path")
			.setDesc("Specify the folder where you want your invoices to be generated. Any folders in the path that do not exist will be created. Note that changing the folder path will not automatically move your existing invoices to the new location.")
			.addText((text) =>
				text
					.setPlaceholder("e.g. invoices/2023")
					.setValue(this.plugin.settings.invoiceFolder)
					.onChange(async (value) => {
						this.plugin.settings.invoiceFolder = value;
						await this.plugin.saveSettings();
					})
					.inputEl.addClass("setting-text")
			);
		new Setting(containerEl)
			.setName("Invoice Number")
			.setDesc("The invoice number is a unique identifier for each invoice. The plugin will automatically increase the invoice number for each new invoice. If you set an invoice number manually, the plugin will start counting from that number for subsequent invoices.")
			.addText((text) =>
				text
					.setPlaceholder("e.g. 1")
					.setValue(this.plugin.settings.invoiceNumber.toString())
					.onChange(async (value) => {
						this.plugin.settings.invoiceNumber = Number.parseInt(value);
						await this.plugin.saveSettings();
					})
					.inputEl.addClass("setting-text")
			);
		new Setting(containerEl)
			.setName("Issuer Name")
			.setDesc("Enter the name of the business or individual issuing the invoices. This name will be included in the invoices as the seller or provider of the goods or services.")
			.addText((text) =>
				text
					.setPlaceholder("e.g. John Doe")
					.setValue(this.plugin.settings.issuerName)
					.onChange(async (value) => {
						this.plugin.settings.issuerName = value;
						await this.plugin.saveSettings();
					})
					.inputEl.addClass("setting-text")
			);
		new Setting(containerEl)
			.setName("Issuer Address")
			.setDesc("Enter the address of the business or individual issuing the invoices. This address will be included in the invoices as the issuer's contact information.")
			.addTextArea((text) =>
				text
					.setPlaceholder(`e.g.:
123 Main St., 
Anytown, 
USA 12345
`.trim())
					.setValue(this.plugin.settings.issuerAddress)
					.onChange(async (value) => {
						this.plugin.settings.issuerAddress = value;
						await this.plugin.saveSettings();
					})
					.inputEl.addClass("setting-text-area")
			);
		new Setting(containerEl)
			.setName("Issuer Email")
			.setDesc("Enter the email address of the person or company issuing the invoices. This will be used as the sender's email address when sending invoices via email.")
			.addText((text) =>
				text
					.setPlaceholder("e.g. john.doe@email.com")
					.setValue(this.plugin.settings.issuerEmail)
					.onChange(async (value) => {
						this.plugin.settings.issuerEmail = value;
						await this.plugin.saveSettings();
					})
					.inputEl.setAttrs({
					class: 'setting-text',
					type: 'email',
				})
			);
		new Setting(containerEl)
			.setName("Hourly Rate")
			.setDesc("Enter your hourly rate in dollars. This rate will be used to calculate the total cost of services on the invoice.")
			.addText((text) =>
				text
					.setPlaceholder("e.g. 69")
					.setValue(this.plugin.settings.hourlyRate.toString())
					.onChange(async (value) => {
						this.plugin.settings.hourlyRate = Number.parseInt(value);
						await this.plugin.saveSettings();
					})
					.inputEl.addClass("setting-text")
			);
		new Setting(containerEl)
			.setName("Wiring Instructions")
			.setDesc("List down instructions for making wire transfer payments of invoices including Bank Account Number, ACH/IBAN/SWIFT CODE and Bank Name".trim())
			.addTextArea((text) =>
				text
					.setPlaceholder(`e.g.:
0098611114
ES02 2331 1111 1111 1111 1111
Barclays
`.trim())
					.setValue(this.plugin.settings.wiringInstructions)
					.onChange(async (value) => {
						this.plugin.settings.wiringInstructions = value;
						await this.plugin.saveSettings();
					})
					.inputEl.addClass("setting-text-area")
			);
	}
}