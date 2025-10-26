import React, { forwardRef } from "react";
import { Input } from "./ui/input";

type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value"
> & {
  value: number | null;
  onChange: (...event: any) => void;
};

const formatBRL = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = null, placeholder = "R$ 0,00", onChange, ...rest }, ref) => {
    const display = formatBRL(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const onlyDigits = e.target.value.replace(/\D/g, "");
      if (onlyDigits === "") {
        onChange(null);
        return;
      }
      const numberValue = parseInt(onlyDigits, 10);
      onChange(numberValue);
    };

    return (
      <Input
        {...rest}
        ref={ref}
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
export default CurrencyInput;
