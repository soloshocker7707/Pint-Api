export const VALID_EMIRATES = ['DXB', 'AUH', 'SHJ', 'AJM', 'UAQ', 'RAK', 'FUJ'];

export const VAT_RATES = {
  standard: 0.05,
  zero_rated: 0,
  exempt: 0
};

export const calculateVAT = (items) => {
  let subtotal = 0;
  let totalVatAmount = 0;
  
  const lineItems = items.map(item => {
    const { name, description, amount, quantity, unit_price, category, vat_category } = item;
    
    // Support both formats (single amount or quantity/unit_price)
    const effectiveAmount = amount || (quantity * unit_price);
    const effectiveCategory = category || vat_category;

    if (typeof effectiveAmount !== 'number' || effectiveAmount < 0) {
        throw new Error(`Invalid amount for item: ${name || description}`);
    }
    
    const rate = VAT_RATES[effectiveCategory?.toLowerCase()] ?? 0.05;

    const vatAmount = effectiveAmount * rate;
    const total = effectiveAmount + vatAmount;

    subtotal += effectiveAmount;
    totalVatAmount += vatAmount;

    return {
      description: name || description,
      amount: effectiveAmount,
      quantity,
      unit_price,
      vat_rate: rate,
      vat_amount: vatAmount,
      total
    };
  });

  return {
    subtotal,
    totalVatAmount,
    total: subtotal + totalVatAmount,
    lineItems
  };
};
