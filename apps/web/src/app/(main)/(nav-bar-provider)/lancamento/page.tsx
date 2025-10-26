"use client";

import { observer } from "mobx-react-lite";
import { Separator } from "@components/ui/separator";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Search } from "lucide-react";
import DisplayHandler from "@components/display-handler";
import transactionDialog from "@features/transactions/transaction-dialog";
import DisplayTransactions from "@features/transactions/display-transaction";

const SpendPage = observer(() => {
  return (
    <div className="flex w-full h-full flex-col ">
      <div className="flex flex-row mb-4 w-full justify-between px-4">
        <span className="text-3xl">Transações</span>
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
          Dialog={transactionDialog}
          Display={DisplayTransactions}
          button={{ message: "Nova Receita", onClick: () => console.log(123) }}
        />

        <Separator orientation="vertical" />

        <DisplayHandler
          type="expenses"
          title="Despesas"
          Dialog={transactionDialog}
          Display={DisplayTransactions}
          button={{ message: "Nova Despesa", onClick: () => console.log(123) }}
        />
      </div>
    </div>
  );
});

export default SpendPage;
