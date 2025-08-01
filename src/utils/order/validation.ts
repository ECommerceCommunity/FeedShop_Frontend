export const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s-]/g, "");
  const phoneRegex = /^01[0-9]{8,9}$/;
  return phoneRegex.test(cleanPhone);
};

export const validatePostalCode = (postalCode: string): boolean => {
  const postalRegex = /^[0-9]{5}$/;
  return postalRegex.test(postalCode);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/[\s-]/g, "");
  const cardRegex = /^[0-9]{13,19}$/;
  return cardRegex.test(cleanNumber);
};

export const validateCardExpiry = (expiry: string): boolean => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!expiryRegex.test(expiry)) return false;

  const [month, year] = expiry.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const cardYear = parseInt(year);
  const cardMonth = parseInt(month);

  if (
    cardYear < currentYear ||
    (cardYear === currentYear && cardMonth < currentMonth)
  ) {
    return false;
  }

  return true;
};

export const validateCVC = (cvc: string): boolean => {
  const cvcRegex = /^[0-9]{3}$/;
  return cvcRegex.test(cvc);
};