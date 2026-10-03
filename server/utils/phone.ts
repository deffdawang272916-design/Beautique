/**
 * Philippine Mobile Number Normalization & Validation Utility
 * Beautique Aesthetics — Santa Rosa, Nueva Ecija
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string; // +639XXXXXXXXX
  localDisplay?: string; // 09XX XXX XXXX
  masked?: string; // +63 9•• ••• •XXX
  error?: string;
}

/**
 * Validates and normalizes Philippine mobile numbers.
 * Supports:
 * - 09XXXXXXXXX (11 digits)
 * - +639XXXXXXXXX (13 chars)
 * - 639XXXXXXXXX (12 digits)
 * - 9XXXXXXXXX (10 digits)
 */
export function validatePhilippineMobileNumber(input: string): PhoneValidationResult {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      error: 'Mobile number is required.',
    };
  }

  // Strip all whitespace, hyphens, parentheses, and dots
  const cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '');

  if (!cleaned) {
    return {
      isValid: false,
      error: 'Mobile number cannot be empty.',
    };
  }

  // Check for non-digit characters (except leading +)
  if (!/^\+?\d+$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Mobile number must contain digits only.',
    };
  }

  let tenDigitCore = '';

  if (cleaned.startsWith('+639')) {
    tenDigitCore = cleaned.slice(3); // 9XXXXXXXXX
  } else if (cleaned.startsWith('639')) {
    tenDigitCore = cleaned.slice(2); // 9XXXXXXXXX
  } else if (cleaned.startsWith('09')) {
    tenDigitCore = cleaned.slice(1); // 9XXXXXXXXX
  } else if (cleaned.startsWith('9')) {
    tenDigitCore = cleaned; // 9XXXXXXXXX
  } else {
    // Check if landline was provided
    if (cleaned.startsWith('02') || cleaned.startsWith('044')) {
      return {
        isValid: false,
        error: 'Please provide a valid Philippine mobile number (09xx). Landlines cannot receive SMS.',
      };
    }
    return {
      isValid: false,
      error: 'Invalid Philippine mobile prefix. Mobile numbers must start with 09 or +639.',
    };
  }

  // Philippine mobile numbers must have exactly 10 digits in core (starting with 9 followed by 9 digits)
  if (tenDigitCore.length !== 10 || !tenDigitCore.startsWith('9')) {
    return {
      isValid: false,
      error: 'Invalid mobile number length. Philippine mobile numbers must be 11 digits (e.g. 0917 123 4567).',
    };
  }

  const normalized = `+63${tenDigitCore}`;
  const localDisplay = `0${tenDigitCore.slice(0, 3)} ${tenDigitCore.slice(3, 6)} ${tenDigitCore.slice(6)}`;
  const masked = `+63 9•• ••• •${tenDigitCore.slice(7)}`;

  return {
    isValid: true,
    normalized,
    localDisplay,
    masked,
  };
}

/**
 * Safely masks a phone number for administrative logs or public customer screens.
 */
export function maskPhoneNumber(phone: string): string {
  const result = validatePhilippineMobileNumber(phone);
  if (result.isValid && result.masked) {
    return result.masked;
  }
  // Generic fallback masking
  if (phone.length > 4) {
    return `${phone.slice(0, 3)}••••${phone.slice(-3)}`;
  }
  return '••••';
}
