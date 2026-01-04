/**
 * Input Mask and Formatting Utilities
 * Provides functions for formatting various types of input fields
 */

/**
 * Format phone number: (XX) XXXXX-XXXX
 */
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 0) return "";
  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

/**
 * Format license plate: ABC-1234 or ABC1D34
 * Accepts both old format (3 letters + 4 numbers) and new format (3 letters + 1 letter + 2 numbers)
 */
export const formatLicensePlate = (value: string): string => {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cleaned.length <= 0) return "";
  if (cleaned.length <= 3) return cleaned;
  
  // Check if it's the new format (3 letters + 1 letter + 2 numbers at positions 3-4)
  const isNewFormat = cleaned.length >= 4 && /^[A-Z]{3}[A-Z0-9]\d{0,3}$/.test(cleaned);
  
  if (isNewFormat) {
    // New format: ABC1D34
    if (cleaned.length <= 7) return cleaned;
    return `${cleaned.slice(0, 7)}`.toUpperCase();
  } else {
    // Old format: ABC-1234
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
  }
};

/**
 * Format CPF: XXX.XXX.XXX-XX
 */
export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 0) return "";
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

/**
 * Format CNPJ: XX.XXX.XXX/XXXX-XX
 */
export const formatCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 0) return "";
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
  if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
  if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
};

/**
 * Format currency: R$ 1.234,56
 */
export const formatCurrency = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 0) return "";
  
  const numValue = parseInt(cleaned, 10) / 100;
  return numValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

/**
 * Allow only numbers in input
 */
export const onlyNumbers = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Allow only letters and spaces
 */
export const onlyLetters = (value: string): string => {
  return value.replace(/[^a-zA-Zà-ÿ\s]/g, "");
};

/**
 * Allow numbers and letters
 */
export const alphanumeric = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9à-ÿ\s]/g, "");
};

/**
 * Handler for numeric inputs - prevent non-numeric input
 */
export const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  const isNumber = /^[0-9]$/.test(e.key);
  
  if (!isNumber && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
};

/**
 * Validate phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 11; // Brazilian phone format (2 area code + 9 digits)
};

/**
 * Validate CPF
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Calculate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i], 10) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[9], 10)) return false;
  
  // Calculate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i], 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[10], 10)) return false;
  
  return true;
};

/**
 * Validate license plate
 */
export const isValidLicensePlate = (plate: string): boolean => {
  const cleaned = plate.replace(/[^A-Z0-9]/g, "").toUpperCase();
  // Old format: 3 letters + 4 numbers, New format: 3 letters + 1 letter + 2 numbers + 1 letter
  return cleaned.length === 7;
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
