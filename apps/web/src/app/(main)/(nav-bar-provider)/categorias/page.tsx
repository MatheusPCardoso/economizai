"use client";

import DisplayHandler from "@components/display-handler";
import { Button } from "@components/ui/button";
import CategoryDialog from "@features/categories/category-dialog";
import { Search } from "lucide-react";
import { Input } from "@components/ui/input";
import DisplayCategories from "@features/categories/display-categories";
import { Separator } from "@components/ui/separator";

const CategoryPage = () => {
  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-row mb-4 w-full justify-between px-4">
        <span className="text-3xl">Categorias</span>
        <div className="flex flex-row items-center w-1/6 gap-1">
          <Input placeholder="Pesquisar" className="w-full rounded-sm" />
          <Button onClick={() => console.log("search")} className="rounded-sm">
            <Search size={20} />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-row w-full justify-between pt-4 px-4 gap-4 min-h-0">
        <DisplayHandler
          key={"incomes"}
          type="incomes"
          title="Receitas"
          button={{
            message: "Nova Categoria",
            onClick: () => console.log(123),
          }}
          Dialog={CategoryDialog}
          Display={DisplayCategories}
        />
        <Separator orientation="vertical" />
        <DisplayHandler
          key={"expenses"}
          type="expenses"
          title="Despesas"
          button={{
            message: "Nova Categoria",
            onClick: () => console.log(123),
          }}
          Dialog={CategoryDialog}
          Display={DisplayCategories}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
