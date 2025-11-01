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
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, FormLabel, FormMessage } from "@components/ui/form";
import { Info } from "lucide-react";
import { Recurring } from "@store/recurring.store";
import { Checkbox } from "@components/ui/checkbox";
import { TransactionTypeEnum } from "../../../types/transaction";

export interface RecurringDialogProps {
  type: "incomes" | "expenses";
  open: boolean;
  editingValue?: Recurring;
  handleClose: () => void;
}

type Inputs = {
  name: string;
  amount: number;
  interval: number;
  startDate: Date;
  endDate?: Date;
  categoryId: string;
  subcategoryId?: string;
};

const RecurringTransactionDialog = ({
  type,
  open,
  editingValue,
  handleClose,
}: RecurringDialogProps) => {
  const { categoryStore, recurringStore } = useStore();
  const [endDate, setEndDate] = useState<boolean>(!!editingValue?.endDate);
  const form = useForm<Inputs>({
    defaultValues: {
      name: "",
      amount: 0,
      interval: 30,
      startDate: new Date(),
      endDate: undefined,
      categoryId: "",
      subcategoryId: "",
    },
  });
  const { control, handleSubmit, formState, reset, watch } = form;

  const subcategories = useMemo(
    () =>
      categoryStore.getCategoryById(watch("categoryId"))?.subcategories || [],
    [watch("categoryId")]
  );

  useEffect(() => {
    reset({
      name: editingValue?.name || "",
      amount: editingValue?.amount || 0,
      interval: editingValue?.interval || 30,
      startDate: editingValue?.startDate || new Date(),
      endDate: editingValue?.endDate || undefined,
      categoryId: editingValue?.categoryId || "",
      subcategoryId: editingValue?.subcategoryId || "",
    });
  }, [editingValue]);

  const onSubmit = (data: Inputs) => {
    const payload = {
      ...data,
      id: editingValue?.id || undefined,
      amount: data.amount,
      subcategoryId: data.subcategoryId || undefined,
      type:
        type === "incomes"
          ? TransactionTypeEnum.INCOME
          : TransactionTypeEnum.EXPENSE,
    };
    const action = editingValue
      ? recurringStore.updateRecurring
      : recurringStore.createRecurring;
    action(payload);
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

        <Form {...form}>
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
                name="interval"
                control={control}
                rules={{ required: "O intervalo é obrigatório" }}
                render={({ field }) => (
                  <div className="w-1/2">
                    <div
                      className="flex items-center gap-1"
                      title="Intervalo de dias para a inserção"
                    >
                      <FormLabel htmlFor="interval">Intervalo</FormLabel>
                      <Info size={15} />
                    </div>
                    <Input
                      type="number"
                      id="interval"
                      min={1}
                      {...field}
                      className="mt-1"
                    />
                    {formState.errors.interval && (
                      <p className="text-sm text-red-600 mt-1">
                        {formState.errors.interval.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              name="startDate"
              control={control}
              rules={{ required: "A data incial é obrigatória" }}
              render={({ field }) => (
                <div className="w-full">
                  <FormLabel htmlFor="startDate">Data inicial</FormLabel>
                  <DatePicker
                    label="Selecione a data"
                    date={field.value}
                    setDate={(d) => field.onChange(d)}
                    className="w-full mt-1"
                  />
                  <FormMessage />
                </div>
              )}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={endDate}
                onCheckedChange={(e) => setEndDate(!!e)}
                id="toggle"
              />
              <Label htmlFor="toggle">Definir data final</Label>
            </div>

            {endDate && (
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "A data incial é obrigatória" }}
                render={({ field }) => (
                  <div className="w-full">
                    <FormLabel htmlFor="endDate">Data final</FormLabel>
                    <DatePicker
                      label="Selecione a data"
                      date={field.value}
                      setDate={(d) => field.onChange(d)}
                      className="w-full mt-1"
                    />
                    <FormMessage />
                  </div>
                )}
              />
            )}

            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Categoria é obrigatória" }}
              render={({ field }) => (
                <div>
                  <Label htmlFor="categoryId">Categoria</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1">
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
                      <SelectTrigger className="w-full mt-1">
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default observer(RecurringTransactionDialog);
