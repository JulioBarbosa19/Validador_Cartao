/**
 * Brand-specific validations
 */
const brandRules = {
  visa: { lengths: [13, 16, 19], prefix: /^4/ },
  mastercard: { lengths: [16], prefix: /^5[1-5]/ },
  amex: { lengths: [15], prefix: /^3[47]/ },
  elo: { lengths: [16], prefix: /^(4011|5066|4576|4916)/ },
  diners: { lengths: [14], prefix: /^3[068]/ },
};

/**
 * Detects the card brand (bandeira) from the card number
 * @param {string} cardNumber - The credit card number (digits only)
 * @returns {string|null} The detected brand or null if not recognized
 */
function detectBandeira(cardNumber) {
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');

  for (const [brandName, rules] of Object.entries(brandRules)) {
    if (rules.prefix.test(cleanNumber) && rules.lengths.includes(cleanNumber.length)) {
      return brandName;
    }
  }

  return null;
}

/**
 * Validates a credit card number and detects its brand
 * @param {string} cardNumber - The credit card number (digits only)
 * @returns {object} Object with { isValid: boolean, bandeira: string|null }
 */
function validateCreditCard(cardNumber) {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');

  // Check if it contains only digits
  if (!/^\d+$/.test(cleanNumber)) {
    return { isValid: false, bandeira: null };
  }

  // Detect the brand
  const detectedBandeira = detectBandeira(cardNumber);

  if (!detectedBandeira) {
    return { isValid: false, bandeira: null };
  }

  // Validate using Luhn algorithm
  const isValid = luhnCheck(cleanNumber);

  return { isValid, bandeira: detectedBandeira };
}

/**
 * Luhn algorithm for credit card validation
 * @param {string} cardNumber - The card number to validate
 * @returns {boolean} True if valid, false otherwise
 */
function luhnCheck(cardNumber) {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Example usage:
const cardNumber = '4111 1111 1111 1111';   
console.log(validateCreditCard(cardNumber)); 
// Output: { isValid: true, bandeira: 'visa' }

console.log(validateCreditCard('5425233010103442'));
// Output: { isValid: true, bandeira: 'mastercard' }

console.log(validateCreditCard('378282246310005'));
// Output: { isValid: true, bandeira: 'amex' }

console.log(validateCreditCard('invalid'));
// Output: { isValid: false, bandeira: null }