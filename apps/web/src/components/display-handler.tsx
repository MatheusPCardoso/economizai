import { FC, useCallback, useState, ComponentType } from "react";
import { Button } from "@components/ui/button";
import { Transaction } from "@store/transaction.store";
import { Recurring } from "@store/recurring.store";
import { Category } from "@store/category.store";

export type HandledTypes = Category | Transaction | Recurring;

export interface DialogProps<T extends HandledTypes> {
  editingValue: T | undefined;
  open: boolean;
  handleClose: () => void;
  type: "incomes" | "expenses";
}

interface DisplayHandlerProps<T extends HandledTypes> {
  type: "incomes" | "expenses";
  title: string;
  button: {
    message: string;
    onClick: () => void;
  };
  Dialog: ComponentType<DialogProps<T>>;
  Display: FC<{ type: "incomes" | "expenses"; onEdit: (value: T) => void }>;
}

const DisplayHandler = <T extends HandledTypes>({
  type,
  title,
  button,
  Dialog,
  Display,
}: DisplayHandlerProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [editingValue, setEditingValue] = useState<T>();

  const handleEdit = useCallback((value: T) => {
    setEditingValue(value);
    setOpen(true);
  }, []);

  const handleOpen = () => {
    setEditingValue(undefined);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingValue(undefined);
  };

  return (
    <div className="w-1/2 flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{title}</span>
        <div className="flex gap-2">
          <Button onClick={handleOpen}>{button?.message}</Button>
        </div>
      </div>
      <Dialog
        type={type}
        open={open}
        editingValue={editingValue}
        handleClose={handleClose}
      />
      <Display type={type} onEdit={handleEdit} />
    </div>
  );
};

export default DisplayHandler;
