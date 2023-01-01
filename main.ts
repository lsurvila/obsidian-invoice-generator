import { App, Modal, Plugin, Vault } from 'obsidian';
import { InvoiceGeneratorSettingTab } from 'settings';

interface InvoiceGeneratorSettings {
  invoiceFolder: string;
}

const DEFAULT_SETTINGS: Partial<InvoiceGeneratorSettings> = {
  invoiceFolder: "invoices",
};

export default class InvoiceGenerator extends Plugin {

	vault: Vault = this.app.vault;
	settings!: InvoiceGeneratorSettings;


	private readonly modal = new SampleModal(this.app);

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new InvoiceGeneratorSettingTab(this.app, this));
		// This creates an icon in the left ribbon.
		this.addRibbonIcon('dice', 'Test Invoice Generator', () => {
			// Called when the user clicks the icon.
			// this.modal.open();
			this.generateInvoice();
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				this.modal.open();
			}
		});

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
  }

	async generateInvoice() {
    // Calculate previous month and year
    const { month, year } = this.getPreviousMonth();

    // Generate page path for previous month's invoice
    const pagePath = this.getInvoicePagePath(month, year);

    // Check if page already exists
    // const files = this.vault.getMarkdownFiles().map((file) => file.path);
    // if (files.includes(await pagePath)) {
    //   console.log(`Invoice for ${month + 1}/${year} already exists!`);
    //   return;
    // }
		if (await this.vault.adapter.exists(await pagePath)) {
			console.log(`Invoice for ${month + 1}/${year} already exists!`);
      return;
		}

    // Create page content for invoice
    const pageContent = this.createInvoiceContent(month, year);

    // Create the page
    await this.app.vault.create(await pagePath, pageContent);
    console.log(`Invoice for ${month + 1}/${year} created!`);
  }

  getPreviousMonth(): { month: number, year: number } {
    // Get current date
    const currentDate = new Date();

    // Get previous month
    let month = currentDate.getMonth() - 1;

    // Get year for previous month
    let year = currentDate.getFullYear();
    if (month < 0) {
      month = 11;
      year -= 1;
    }

    return { month, year };
  }

	async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async getInvoicePagePath(month: number, year: number): Promise<string> {
    // Convert month and year to strings, pad month with leading zero if necessary
    const monthStr = (month + 1).toString().padStart(2, '0');
    const yearStr = year.toString();

		// Get invoice folder from plugin settings
		const invoiceFolder = this.settings.invoiceFolder;
		const directories = `${invoiceFolder}`.split('/');
		console.log(directories)

		// Create folder(s)
		await this.vault.adapter.mkdir(invoiceFolder);

    // Return file name with invoice folder prefix
    return `${invoiceFolder}/Invoice ${yearStr}-${monthStr}.md`;
  }

  createInvoiceContent(_month: number, _year: number): string {
		return `TODO: Add invoice content here.`;
  }

	onunload() {
		// this.modal.close();
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
