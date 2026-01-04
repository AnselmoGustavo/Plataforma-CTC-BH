import React from "react";
import { Input } from "@/components/ui/input";
import {
  formatPhoneNumber,
  formatLicensePlate,
  formatCPF,
  formatCNPJ,
  formatCurrency,
  onlyNumbers,
  onlyLetters,
  alphanumeric,
  isValidPhoneNumber,
  isValidEmail,
} from "@/lib/inputMasks";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: "phone" | "plate" | "cpf" | "cnpj" | "currency" | "numeric" | "letters" | "alphanumeric";
  onValueChange?: (value: string) => void;
}

const getMaskFunction = (mask?: string) => {
  switch (mask) {
    case "phone":
      return formatPhoneNumber;
    case "plate":
      return formatLicensePlate;
    case "cpf":
      return formatCPF;
    case "cnpj":
      return formatCNPJ;
    case "currency":
      return formatCurrency;
    case "numeric":
      return onlyNumbers;
    case "letters":
      return onlyLetters;
    case "alphanumeric":
      return alphanumeric;
    default:
      return (val: string) => val;
  }
};

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, onValueChange, value, ...props }, ref) => {
    const maskFn = getMaskFunction(mask);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      newValue = maskFn(newValue);
      
      // Update the input value
      e.target.value = newValue;
      
      // Call original onChange if provided
      onChange?.(e);
      
      // Get clean value (only numbers for masked inputs)
      const cleanValue = newValue.replace(/\D/g, "");
      onValueChange?.(cleanValue);
    };

    return (
      <Input
        ref={ref}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export default MaskedInput;
