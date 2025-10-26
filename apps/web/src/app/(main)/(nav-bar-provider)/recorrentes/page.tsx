"use client";

import { observer } from "mobx-react-lite";
import { Separator } from "@components/ui/separator";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Search } from "lucide-react";
import DisplayHandler from "@components/display-handler";
import recurringTransactionDialog from "@features/transactions/recurring-transaction-dialog";
import DisplayRecurring from "@features/transactions/display-recurring";

const RecurringPage = observer(() => {
  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-row mb-4 w-full justify-between px-4">
        <span className="text-3xl">Recorrentes</span>
        <div className="flex flex-row items-center w-1/6 gap-1">
          <Input placeholder="Pesquisar" className="w-full rounded-sm" />
          <Button onClick={() => console.log("search")} className="rounded-sm">
            <Search size={20} />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-row w-full justify-between pt-4 px-4 gap-4 min-h-0">
        <DisplayHandler
          type="incomes"
          title="Receitas"
          Dialog={recurringTransactionDialog}
          Display={DisplayRecurring}
          button={{ message: "Nova Receita", onClick: () => console.log(123) }}
        />
        <Separator orientation="vertical" />
        <DisplayHandler
          type="expenses"
          title="Despesas"
          Dialog={recurringTransactionDialog}
          Display={DisplayRecurring}
          button={{ message: "Nova Despesa", onClick: () => console.log(123) }}
        />
      </div>
    </div>
  );
});

export default RecurringPage;
