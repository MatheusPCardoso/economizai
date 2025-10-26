"use client";

import CurrencyInput from "@components/input-brl-currency";
import { Button } from "@components/ui/button";
import { DatePicker } from "@components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useStore } from "@store/store.context";
import { Transaction } from "@store/transaction.store";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { TransactionTypeEnum } from "../../../types/transaction";

export interface TransactionDialogProps {
  type: "incomes" | "expenses";
  open: boolean;
  editingValue?: Transaction;
  handleClose: () => void;
}

type Inputs = {
  name: string;
  amount: number;
  reference: Date;
  categoryId: string;
  subcategoryId?: string;
};

const TransactionDialog = ({
  type,
  open,
  editingValue,
  handleClose,
}: TransactionDialogProps) => {
  const { categoryStore, transactionStore } = useStore();
  const { control, handleSubmit, formState, reset, watch } = useForm<Inputs>({
    defaultValues: {
      name: editingValue?.name || "",
      amount: editingValue?.amount || 0,
      reference: editingValue?.reference || new Date(),
      categoryId: editingValue?.categoryId || "",
      subcategoryId: editingValue?.subcategoryId || "",
    },
  });

  const subcategories = useMemo(
    () =>
      categoryStore.getCategoryById(watch("categoryId"))?.subcategories || [],
    [watch("categoryId")]
  );

  useEffect(() => {
    reset({
      name: editingValue?.name || "",
      amount: editingValue?.amount || 0,
      reference: editingValue?.reference || new Date(),
      categoryId: editingValue?.categoryId || "",
      subcategoryId: editingValue?.subcategoryId || "",
    });
  }, [editingValue]);

  const onSubmit = (data: Inputs) => {
    const payload = {
      ...data,
      id: editingValue?.id || undefined,
      amount: data.amount,
      type:
        type === "incomes"
          ? TransactionTypeEnum.INCOME
          : TransactionTypeEnum.EXPENSE,
      subcategoryId: data.subcategoryId || undefined,
    };
    const action = editingValue
      ? transactionStore.updateTransaction
      : transactionStore.createTransaction;
    action(payload);
    reset();
    handleClose();
  };

  const categories = categoryStore[type];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Inserir ${type === "incomes" ? "Receita" : "Despesa"}`}</DialogTitle>
          <DialogDescription>
            Adicione os dados abaixo para criar uma nova
            {type === "incomes" ? " receita" : " despesa"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Nome é obrigatório" }}
            render={({ field }) => (
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...field} className="mt-1" />
                {formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {formState.errors.name.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex justify-between space-x-4">
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "Valor é obrigatório",
                validate: (value) => value > 0 || "O valor deve ser positivo",
              }}
              render={({ field }) => (
                <div className="w-1/2">
                  <Label htmlFor="amount">Valor</Label>
                  <CurrencyInput
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="R$ 0,00"
                    className="mt-1"
                  />
                  {formState.errors.amount && (
                    <p className="text-sm text-red-600 mt-1">
                      {formState.errors.amount.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="reference"
              control={control}
              rules={{ required: "Data é obrigatória" }}
              render={({ field }) => (
                <div className="w-1/2">
                  <Label htmlFor="reference">Data</Label>
                  <DatePicker
                    label="Selecione a data"
                    date={field.value}
                    setDate={(d) => field.onChange(d)}
                    className="w-full mt-1"
                  />
                  {formState.errors.reference && (
                    <p className="text-sm text-red-600 mt-1">
                      {formState.errors.reference.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Categoria é obrigatória" }}
            render={({ field }) => (
              <div>
                <Label htmlFor="categoryId">Categoria</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formState.errors.categoryId && (
                  <p className="text-sm text-red-600 mt-1">
                    {formState.errors.categoryId.message}
                  </p>
                )}
              </div>
            )}
          />

          {subcategories && subcategories.length > 0 && (
            <Controller
              name="subcategoryId"
              control={control}
              rules={{ required: "Subcategoria é obrigatória" }}
              render={({ field }) => (
                <div>
                  <Label htmlFor="subcategoryId">Subcategoria</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione uma subcategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories?.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formState.errors.subcategoryId && (
                    <p className="text-sm text-red-600 mt-1">
                      {formState.errors.subcategoryId.message}
                    </p>
                  )}
                </div>
              )}
            />
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                handleClose();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default observer(TransactionDialog);
