"use client";

import { Button } from "@components/ui/button";
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
import { Category } from "@store/category.store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { incomes, expenses } from "@constants/lucide-icons";
import { PlusCircle, Trash2 } from "lucide-react";
import DynamicIcon from "@components/dynamic-icon";
import { SelectVirtualized } from "@components/select-virtualized";

export interface CategoryDialogProps {
  type: "incomes" | "expenses";
  open: boolean;
  editingValue?: Category;
  handleClose: () => void;
}

type Inputs = {
  name: string;
  icon: string;
  subcategories?: {
    id?: string;
    name: string;
    icon: string;
    isDefault: boolean;
  }[];
};

const CategoryDialog = ({
  type,
  open,
  editingValue,
  handleClose,
}: CategoryDialogProps) => {
  const { categoryStore } = useStore();
  const { control, handleSubmit, formState, reset } = useForm<Inputs>({
    defaultValues: {
      name: editingValue?.name || "",
      icon: editingValue?.icon || "",
      subcategories: editingValue?.subcategories || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subcategories",
  });

  useEffect(() => {
    reset({
      name: editingValue?.name || "",
      icon: editingValue?.icon || "",
      subcategories: editingValue?.subcategories || [],
    });
  }, [editingValue, reset]);

  const onSubmit = (data: Inputs) => {
    const payload = {
      ...data,
      id: editingValue?.id,
      type: type === "incomes" ? "INCOME" : "EXPENSE",
      subcategories: data.subcategories || [],
    };

    const action = editingValue
      ? categoryStore.updateCategory
      : categoryStore.createCategory;

    action(payload as Category);
    reset();
    handleClose();
  };

  const iconList = type === "incomes" ? incomes : expenses;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{`${editingValue ? "Editar" : "Inserir"} ${
            type === "incomes" ? "Receita" : "Despesa"
          }`}</DialogTitle>
          <DialogDescription>
            Adicione os dados abaixo para{" "}
            {editingValue ? "editar a" : "criar uma nova"}
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
            disabled={editingValue && editingValue.isDefault}
            render={({ field }) => (
              <div>
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input id="name" {...field} className="mt-1" />
                {formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {formState.errors.name.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="icon"
            control={control}
            rules={{ required: "Ícone é obrigatório" }}
            disabled={editingValue && editingValue.isDefault}
            render={({ field }) => (
              <div>
                <Label htmlFor="icon">Ícone da Categoria</Label>
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconList.map((iconName) => (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          <DynamicIcon
                            name={iconName as any}
                            className="h-4 w-4"
                          />
                          <span>{iconName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formState.errors.icon && (
                  <p className="text-sm text-red-600 mt-1">
                    {formState.errors.icon.message}
                  </p>
                )}
              </div>
            )}
          />

          <div>
            <Label>Subcategorias (opcional)</Label>
            <div className="space-y-2 mt-1 max-h-[200px] overflow-y-auto">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 py-1">
                  <div className="flex-1 space-y-1">
                    <div className="flex gap-2">
                      <Controller
                        name={`subcategories.${index}.name`}
                        control={control}
                        rules={{ required: "Nome é obrigatório" }}
                        disabled={field && field.isDefault}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="flex flex-1"
                            placeholder={`Nome da Sub. ${index + 1}`}
                          />
                        )}
                      />
                      <Controller
                        name={`subcategories.${index}.icon`}
                        control={control}
                        rules={{ required: "Ícone é obrigatório" }}
                        disabled={field && field.isDefault}
                        render={({ field }) => (
                          <SelectVirtualized
                            iconList={iconList}
                            field={field as any}
                          />
                        )}
                      />
                    </div>
                    {formState.errors.subcategories?.[index]?.name && (
                      <p className="text-sm text-red-600">
                        {formState.errors.subcategories[index]?.name?.message}
                      </p>
                    )}
                    {formState.errors.subcategories?.[index]?.icon && (
                      <p className="text-sm text-red-600">
                        {formState.errors.subcategories[index]?.icon?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-px"
                    disabled={field && field.isDefault}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => append({ name: "", icon: "", isDefault: false })}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Subcategoria
              </Button>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4 pt-2">
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

export default observer(CategoryDialog);
