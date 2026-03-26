// ─── SHARED VALIDATION UTILS ──────────────────────────────────
// Used by AddRecipientModal and AddAccountModal

// ─── COMMON VALIDATORS ───────────────────────────────────────
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPhone = (phone) => /^[\d\s\+\-()]{7,15}$/.test(phone);
export const isNumeric = (value) => /^\d+$/.test(value);

// ─── RECIPIENT VALIDATION ────────────────────────────────────
export const validateRecipient = (form) => {
  if (!form.fullName?.trim() || form.fullName.trim().length < 2)
    return 'Name must be at least 2 characters';
  if (!form.fullName.trim().match(/^[a-zA-Z\s.'-]+$/))
    return 'Name must contain only letters, spaces, dots, and hyphens';

  if (!form.email?.trim())
    return 'Email is required';
  if (!isValidEmail(form.email))
    return 'Please enter a valid email address';

  if (!form.phone?.trim())
    return 'Phone number is required';
  if (!isValidPhone(form.phone))
    return 'Please enter a valid phone number (7-15 digits)';

  if (!form.country)
    return 'Please select a country';

  if (!form.bankAccount?.trim())
    return 'Bank account is required';
  if (!/^[\dA-Za-z\-\s]+$/.test(form.bankAccount.trim()))
    return 'Bank account must contain only numbers, letters, and dashes';

  if (!form.ifscCode?.trim())
    return 'Bank code is required';

  // Country-specific bank code validation
  const country = form.country;

  if (country === 'India') {
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.ifscCode))
      return 'Invalid IFSC code format (e.g. HDFC0001234)';
  }
  if (country === 'United Kingdom') {
    const cleanSort = form.ifscCode.replace(/[^\d]/g, '');
    if (cleanSort.length !== 6)
      return 'Sort code must be 6 digits (e.g. 20-00-00)';
  }
  if (country === 'Europe') {
    const cleanIban = form.ifscCode.replace(/\s/g, '');
    if (cleanIban.length < 15 || cleanIban.length > 34)
      return 'IBAN must be 15-34 characters';
  }
  if (country === 'UAE') {
    if (!form.ifscCode.toUpperCase().startsWith('AE'))
      return 'UAE IBAN must start with AE';
    if (form.ifscCode.replace(/\s/g, '').length !== 23)
      return 'UAE IBAN must be exactly 23 characters';
  }

  return null;
};

// ─── ACCOUNT VALIDATION ──────────────────────────────────────
export const validateAccount = (formData, countryCode, config) => {
  if (!formData.holder_name?.trim() || formData.holder_name.trim().length < 2)
    return 'Holder name must be at least 2 characters';

  if (!formData.bank_name?.trim())
    return 'Bank name is required';

  if (!formData.account_type)
    return 'Please select account type';

  // Validate all country-specific fields are filled
  if (config) {
    for (const field of config.fields) {
      if (!formData[field.key]?.trim())
        return `${field.label} is required`;
    }
  }

  // Country-specific field validation
  switch (countryCode) {
    case 'US':
      if (!isNumeric(formData.account_no))
        return 'Account number must contain only digits';
      if (formData.account_no.length < 8 || formData.account_no.length > 17)
        return 'US account number must be 8-17 digits';
      if (!/^\d{9}$/.test(formData.routing_no))
        return 'Routing number must be exactly 9 digits';
      break;

    case 'IN':
      if (!isNumeric(formData.account_no))
        return 'Account number must contain only digits';
      if (formData.account_no.length < 9 || formData.account_no.length > 18)
        return 'India account number must be 9-18 digits';
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifsc_code))
        return 'Invalid IFSC code format (e.g. HDFC0001234)';
      break;

    case 'GB': {
      const cleanAcct = formData.account_no.replace(/[^\d]/g, '');
      if (cleanAcct.length !== 8)
        return 'UK account number must be exactly 8 digits';
      const cleanSort = formData.sort_code.replace(/[^\d]/g, '');
      if (cleanSort.length !== 6)
        return 'Sort code must be 6 digits (e.g. 20-00-00)';
      break;
    }

    case 'EU': {
      const cleanIban = formData.iban.replace(/\s/g, '');
      if (cleanIban.length < 15 || cleanIban.length > 34)
        return 'IBAN must be 15-34 characters';
      if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/i.test(cleanIban))
        return 'Invalid IBAN format';
      if (formData.bic_swift && !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(formData.bic_swift))
        return 'Invalid BIC/SWIFT code (8 or 11 characters)';
      break;
    }

    case 'AU': {
      const cleanBsb = formData.bsb_code.replace(/[^\d]/g, '');
      if (cleanBsb.length !== 6)
        return 'BSB must be 6 digits (e.g. 062-000)';
      const cleanAcct = formData.account_no.replace(/[^\d]/g, '');
      if (cleanAcct.length < 6 || cleanAcct.length > 10)
        return 'Australia account number must be 6-10 digits';
      break;
    }

    case 'CA':
      if (!/^\d{5}$/.test(formData.transit_no))
        return 'Transit number must be exactly 5 digits';
      if (formData.institution_no && !/^\d{3}$/.test(formData.institution_no))
        return 'Institution number must be exactly 3 digits';
      if (formData.account_no.length < 5 || formData.account_no.length > 12)
        return 'Canada account number must be 5-12 digits';
      break;

    case 'SG':
      if (!/^\d{4}$/.test(formData.bank_code))
        return 'Bank code must be exactly 4 digits';
      if (formData.account_no.length < 9 || formData.account_no.length > 12)
        return 'Singapore account number must be 9-12 digits';
      break;

    case 'AE': {
      const cleanIban = formData.iban.replace(/\s/g, '').toUpperCase();
      if (!cleanIban.startsWith('AE'))
        return 'UAE IBAN must start with AE';
      if (cleanIban.length !== 23)
        return 'UAE IBAN must be exactly 23 characters';
      break;
    }
  }

  return null;
};

// ─── REGISTER VALIDATION ─────────────────────────────────────
export const validateRegister = (form) => {
  if (!form.fullName?.trim() || form.fullName.trim().length < 2)
    return 'Name must be at least 2 characters';
  if (!/^[a-zA-Z\s]+$/.test(form.fullName.trim()))
    return 'Name must contain only letters and spaces';

  if (!form.email?.trim())
    return 'Email is required';
  if (!isValidEmail(form.email))
    return 'Please enter a valid email address';

  if (!form.password || form.password.length < 6)
    return 'Password must be at least 6 characters';
  if (form.password.length > 128)
    return 'Password must be less than 128 characters';

  return null;
};

// ─── TRANSFER VALIDATION ─────────────────────────────────────
export const validateTransfer = (amount, currency) => {
  if (!amount || amount <= 0)
    return 'Amount must be greater than zero';
  if (amount < 1)
    return 'Minimum transfer amount is $1.00';
  if (amount > 50000)
    return 'Maximum transfer amount is $50,000';

  const validCurrencies = ['USD', 'GBP', 'EUR', 'INR', 'AUD', 'CAD', 'SGD', 'AED'];
  if (currency && !validCurrencies.includes(currency))
    return 'Invalid currency';

  return null;
};