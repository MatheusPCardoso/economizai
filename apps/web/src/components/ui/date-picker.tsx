"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { ComponentProps, useState } from "react";
import { cn } from "@lib/utils";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

type DatePickerProps = Omit<
  ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect"
> & {
  label: string;
  date?: Date;
  setDate: (date: Date | undefined) => void;
};

export function DatePicker({
  className,
  date,
  label,
  setDate,
  ...calendarProps
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn("w-48 justify-between font-normal", className)}
          >
            {date ? format(date, "PPP", { locale: ptBR }) : label}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            locale={ptBR}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              setOpen(false);
            }}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
