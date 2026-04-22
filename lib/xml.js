import { create } from 'xmlbuilder2';

export const buildPintInvoice = ({ seller, buyer, items, summary, invoice_number, date }) => {
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('Invoice', {
      'xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
      'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
      'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
    })
      .ele('cbc:CustomizationID').txt('urn:fdc:peppol.eu:poacc:trns:billing:3.0:pint:1.0').up()
      .ele('cbc:ProfileID').txt('urn:fdc:peppol.eu:poacc:bis:billing:3.0').up()
      .ele('cbc:ID').txt(invoice_number).up()
      .ele('cbc:IssueDate').txt(date).up()
      .ele('cbc:InvoiceTypeCode').txt('380').up()
      .ele('cbc:DocumentCurrencyCode').txt('AED').up()
      
      .ele('cac:AccountingSupplierParty')
        .ele('cac:Party')
          .ele('cac:PartyName').ele('cbc:Name').txt(seller.name).up().up()
          .ele('cac:PostalAddress')
            .ele('cbc:StreetName').txt(seller.address).up()
            .ele('cbc:CityName').txt(seller.emirate).up()
            .ele('cac:Country').ele('cbc:IdentificationCode').txt('AE').up().up()
          .up()
          .ele('cac:PartyTaxScheme')
            .ele('cbc:CompanyID').txt(seller.trn).up()
            .ele('cac:TaxScheme').ele('cbc:ID').txt('VAT').up().up()
          .up()
        .up()
      .up()

      .ele('cac:AccountingCustomerParty')
        .ele('cac:Party')
          .ele('cac:PartyName').ele('cbc:Name').txt(buyer.name).up().up()
          .ele('cac:PostalAddress')
            .ele('cbc:StreetName').txt(buyer.address).up()
            .ele('cac:Country').ele('cbc:IdentificationCode').txt('AE').up().up()
          .up()
          .ele('cac:PartyTaxScheme')
            .ele('cbc:CompanyID').txt(buyer.trn).up()
            .ele('cac:TaxScheme').ele('cbc:ID').txt('VAT').up().up()
          .up()
        .up()
      .up()

      .ele('cac:TaxTotal')
        .ele('cbc:TaxAmount', { currencyID: 'AED' }).txt(summary.totalVatAmount.toFixed(2)).up()
        .ele('cac:TaxSubtotal')
          .ele('cbc:TaxableAmount', { currencyID: 'AED' }).txt(summary.subtotal.toFixed(2)).up()
          .ele('cbc:TaxAmount', { currencyID: 'AED' }).txt(summary.totalVatAmount.toFixed(2)).up()
          .ele('cac:TaxCategory')
            .ele('cbc:ID').txt('S').up()
            .ele('cbc:Percent').txt('5').up()
            .ele('cac:TaxScheme').ele('cbc:ID').txt('VAT').up().up()
          .up()
        .up()
      .up()

      .ele('cac:LegalMonetaryTotal')
        .ele('cbc:LineExtensionAmount', { currencyID: 'AED' }).txt(summary.subtotal.toFixed(2)).up()
        .ele('cbc:TaxExclusiveAmount', { currencyID: 'AED' }).txt(summary.subtotal.toFixed(2)).up()
        .ele('cbc:TaxInclusiveAmount', { currencyID: 'AED' }).txt(summary.total.toFixed(2)).up()
        .ele('cbc:PayableAmount', { currencyID: 'AED' }).txt(summary.total.toFixed(2)).up()
      .up();

  items.forEach((item, index) => {
    doc.ele('cac:InvoiceLine')
      .ele('cbc:ID').txt((index + 1).toString()).up()
      .ele('cbc:InvoicedQuantity', { unitCode: 'H87' }).txt(item.quantity.toString()).up()
      .ele('cbc:LineExtensionAmount', { currencyID: 'AED' }).txt(item.amount.toFixed(2)).up()
      .ele('cac:Item')
        .ele('cbc:Name').txt(item.description).up()
        .ele('cac:ClassifiedTaxCategory')
          .ele('cbc:ID').txt(item.vat_rate > 0 ? 'S' : 'Z').up()
          .ele('cbc:Percent').txt((item.vat_rate * 100).toString()).up()
          .ele('cac:TaxScheme').ele('cbc:ID').txt('VAT').up().up()
        .up()
      .up()
      .ele('cac:Price')
        .ele('cbc:PriceAmount', { currencyID: 'AED' }).txt(item.unit_price.toFixed(2)).up()
      .up()
    .up();
  });

  return doc.end({ prettyPrint: true });
};
