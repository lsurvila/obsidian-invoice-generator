# Invoice Generator Plugin for Obsidian

This plugin allows you to generate montlhy invoices for your long-term clients directly from Obsidian. Simply specify
information in plugin settings, and the plugin will generate an invoice in markdown format that you can save and send to
your client. The plugin will calculate the invoice amount based on the number of hours worked in the previous month,
excluding weekends.

## Installation (TODO)

1. Download the `obsidian-invoice-generator.zip` file from the releases page.
2. In Obsidian, go to the **Plugins** tab in the **Settings** window.
3. Click the **Install Plugin** button and select the `obsidian-invoice-generator.zip` file.
4. Activate the plugin by clicking the **Activate** button.

## Configuration

The following options can be configured in the plugin's settings:

-   **Invoice Folder**: The folder where the generated invoices will be saved.
-   **Issuer Name**: Your name or the name of your business. This will appear on the invoice as the issuer.
-   **Issuer Address**: Your address or the address of your business. This will appear on the invoice as the issuer's
    address.
-   **Issuer Email**: Your email address. This will appear on the invoice as the issuer's contact email.
-   **Hourly Rate**: The rate that you charge for your services, in dollars per hour.
-   **Wiring Instructions**: Instructions for making wire transfer payments of invoices.

## Features

-   Generate invoices in markdown format for easy saving and sending to long-term clients.
-   Customize the issuer information and hourly rate in the plugin's settings.
-   Choose the folder where the generated invoices will be saved.
-   Quickly access the invoice generator from anywhere in Obsidian using the ribbon feature.

## Usage (TODO)

To access generator use ribbon feature. Based on this configuration:

<img width="677" alt="Screenshot 2023-01-02 at 02 51 15" src="https://user-images.githubusercontent.com/362024/210190520-28258f65-70a7-4341-92f1-3c892fadd47f.png">

Invoice file `Invoice for December 2022 - John Doe (#0001).md` will be created (which can also be exported as PDF
using `Obsidian->File->Export PDF`):

<img width="746" alt="Screenshot 2023-01-02 at 02 52 47" src="https://user-images.githubusercontent.com/362024/210190528-6a554f12-981d-428a-8a79-baaf4185d5f5.png">

## Support

My first Obsidian Plugin, still working on it. If you have any issues or questions about the Invoice Generator plugin,
please don't hesitate to [contact me](mailto:liudas.survila@gmail.com).
