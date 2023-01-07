import { Plugin, Vault, Workspace } from "obsidian";
import { InvoiceGeneratorSettingTab } from "settings";
import { format, getDaysInMonth, isWeekend } from "date-fns";

interface InvoiceGeneratorSettings {
	invoiceFolder: string;
	invoiceNumber: number;
	issuerName: string;
	issuerAddress: string;
	issuerEmail: string;
	hourlyRate: number;
	wiringInstructions: string;
}

const DEFAULT_SETTINGS: Partial<InvoiceGeneratorSettings> = {
	invoiceFolder: "invoices",
	invoiceNumber: 1,
	issuerName: "",
	issuerAddress: "",
	issuerEmail: "",
	hourlyRate: 0,
	wiringInstructions: "",
};

export default class InvoiceGenerator extends Plugin {
	vault: Vault = this.app.vault;
	workspace: Workspace = this.app.workspace;
	settings!: InvoiceGeneratorSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new InvoiceGeneratorSettingTab(this.app, this));
		// This creates an icon in the left ribbon.
		this.addRibbonIcon("dollar-sign", "Generate Monthly Invoice", () => {
			// Called when the user clicks the icon.
			// this.modal.open();
			this.generateInvoice();
		});

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	async generateInvoice() {
		// Get current invoice number from plugin settings
		let invoiceNumber = this.settings.invoiceNumber;

		// Get name of invoice issuer
		const issuerName = this.settings.issuerName;

		// Calculate previous month and year
		const { month, year } = this.getPreviousMonth();
		// Convert month and year to strings
		const date = format(new Date(year, month), "MMMM yyyy");

		// The number of hours of service provided in the previous month
		const workingHours = this.calculateWorkingHours(month, year);

		// Generate page path for previous month's invoice
		const pagePath = this.getInvoicePagePath(
			invoiceNumber,
			issuerName,
			date
		);

		// Create page content for invoice
		const pageContent = this.createInvoiceContent(
			invoiceNumber,
			issuerName,
			date,
			workingHours
		);

		// Create the page
		const page = await this.vault.create(await pagePath, pageContent);
		console.log(`${pagePath} created!`);

		// Increment invoice number and save it to plugin settings
		invoiceNumber += 1;
		this.settings.invoiceNumber = invoiceNumber;
		await this.saveSettings();

		// Open invoice page in the current Obsidian workspace
		await this.workspace.getLeaf().openFile(page);
	}

	calculateWorkingHours(month: number, year: number): number {
		const daysInMonth = getDaysInMonth(new Date(year, month)); // The number of days in the previous month
		let workdays = 0;

		// Loop through each day of the previous month
		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Date(year, month, i);
			if (!isWeekend(date)) {
				// If the day is not a weekend day, increment the workdays counter
				workdays++;
			}
		}
		return workdays * 8;
	}

	getPreviousMonth(): { month: number; year: number } {
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
		console.log(month + " " + year);
		return { month, year };
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async getInvoicePagePath(
		invoiceNumber: number,
		issuerName: string,
		date: string
	): Promise<string> {
		const invoiceNumberStr = `${invoiceNumber.toString().padStart(4, "0")}`;

		// Generate invoice page file name with invoice number included
		const invoicePageName = `Invoice for ${date} - ${issuerName} (#${invoiceNumberStr})`;

		// Get invoice folder from plugin settings
		const invoiceFolder = this.settings.invoiceFolder;

		// Create folder(s)
		await this.vault.adapter.mkdir(invoiceFolder);

		// Return file name with invoice folder prefix
		return `${invoiceFolder}/${invoicePageName}.md`;
	}

	createInvoiceContent(
		invoiceNumber: number,
		issuerName: string,
		date: string,
		workingHours: number
	): string {
		const currentDate = format(new Date(), "dd-MM-yyyy");
		const issuerAddress = this.settings.issuerAddress;
		const issuerEmail = this.settings.issuerEmail;
		const hourlyRate = this.settings.hourlyRate.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
		const amount = (this.settings.hourlyRate * workingHours).toLocaleString(
			"en-US",
			{
				style: "currency",
				currency: "USD",
			}
		);
		const wiringInstructions =
			this.settings.wiringInstructions.split(/\r?\n/);
		return `
# Invoice

Date: ${currentDate}
Invoice Number: ${invoiceNumber}

${issuerName}
${issuerAddress}
${issuerEmail}

------------

| Description                 | Hours           | Rate             | Amount     |
|-----------------------------|-----------------|------------------|------------|
| Rendered services (${date}) | ${workingHours} | ${hourlyRate}/hr | ${amount}  |
|                             |                 |                  |            |
|                             |                 |                  |            |
|                             |                 |            Total | ${amount}  |

## Wiring Instructions
|                       |                               |
|-----------------------|-------------------------------|
| Bank Account Number   | ${wiringInstructions[0]}      |
| ACH, IBAN, SWIFT CODE | ${wiringInstructions[1]}      |
| Bank Name             | ${wiringInstructions[2]}      |
`.trim();
	}
}
