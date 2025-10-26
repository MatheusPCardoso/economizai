import DynamicIcon, { IconName } from "@components/dynamic-icon";
import { observer } from "mobx-react-lite";
import { useStore } from "@store/store.context";
import { Transaction } from "@store/transaction.store";
import ActionButtons from "@components/action-button";
import Image from "next/image";
import { cn } from "@lib/utils";
import { Skeleton } from "@/src/components/ui/skeleton";

interface DisplayItemsProps {
  type: "incomes" | "expenses" | "all";
  onEdit?: (transaction: Transaction) => void;
  showSkeleton?: boolean;
}

const EmptyState = ({
  img,
  text,
  imgWidth = 200,
  imgHeight = 200,
}: {
  img: string;
  text: string;
  imgWidth?: number;
  imgHeight?: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 self-center h-full w-full">
      <Image
        src={img}
        alt={text}
        width={imgWidth}
        height={imgHeight}
        loading="lazy"
      />
      <span className="text-2xl font-semibold">{text}</span>
    </div>
  );
};

const DisplayTransactions = observer(
  ({ type, onEdit, showSkeleton = false }: DisplayItemsProps) => {
    const { categoryStore, transactionStore } = useStore();
    const items = transactionStore[type];

    if (showSkeleton) {
      return <Skeleton className="h-full w-full bg-gray-500" />;
    }

    if (!items?.length) {
      return (
        <EmptyState
          img={`/assets/images/${type}.svg`}
          text={`Nenhuma transação ${type === "incomes" ? "recebida" : "paga"}`}
          imgWidth={type === "incomes" ? 220 : 350}
        />
      );
    }

    const handleDelete = (id: string) => transactionStore.deleteTransaction(id);

    return (
      <div className="h-full overflow-y-auto pr-2">
        {items.map((item) => {
          const category = categoryStore.getCategoryById(item?.categoryId);
          return (
            <div
              key={item.id}
              className="bg-secondary grid grid-cols-12 px-10 mb-3 h-14 rounded-lg"
            >
              <div className="col-span-1 flex items-center justify-center">
                {category && <DynamicIcon name={category.icon as IconName} />}
              </div>
              <div className="flex flex-col items-start justify-center px-2 col-span-7">
                <span className="max-w-96 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.reference.toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className={"flex items-center justify-center col-span-2"}>
                <span
                  className={cn(
                    "text-destructive",
                    item.type === "INCOME" && "text-success"
                  )}
                >
                  {(item.amount / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              {onEdit && (
                <div className="col-span-2 flex items-center justify-center">
                  <ActionButtons
                    rowId={item.id}
                    onEdit={() => onEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

export default DisplayTransactions;
