import InvoiceGenerator from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class InvoiceGeneratorSettingTab extends PluginSettingTab {
  plugin: InvoiceGenerator;

  constructor(app: App, plugin: InvoiceGenerator) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Invoice Folder Path")
      .setDesc("Specify the folder where you want your invoices to be generated. Any folders in the path that do not exist will be created. Note that changing the folder path will not automatically move your existing invoices to the new location.")
      .setTooltip("If any folder in specified path does not exist, it will be automatically created.")
      .addText((text) =>
        text
          .setPlaceholder("invoices")
          .setValue(this.plugin.settings.invoiceFolder)
          .onChange(async (value) => {
            this.plugin.settings.invoiceFolder = value;
            await this.plugin.saveSettings();
          })
      );
  }
}