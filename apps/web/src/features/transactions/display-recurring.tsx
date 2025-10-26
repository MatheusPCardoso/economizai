import DynamicIcon, { IconName } from "@components/dynamic-icon";
import { observer } from "mobx-react-lite";
import { useStore } from "@store/store.context";
import ActionButtons from "@components/action-button";
import Image from "next/image";
import { cn } from "@lib/utils";
import { Recurring } from "@store/recurring.store";

interface DisplayRecurringProps {
  type: "incomes" | "expenses" | "all";
  onEdit: (recurring: Recurring) => void;
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

const DisplayRecurring = observer(({ type, onEdit }: DisplayRecurringProps) => {
  const { categoryStore, recurringStore } = useStore();
  const items = recurringStore[type];

  if (!items?.length) {
    return (
      <EmptyState
        img={`/assets/images/${type}.svg`}
        text={`Nenhuma transação ${type === "incomes" ? "recebida" : "paga"}`}
        imgWidth={type === "incomes" ? 220 : 350}
      />
    );
  }

  const handleDelete = (id: string) => recurringStore.deleteRecurring(id);

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
                todo dia{" "}
                {item?.startDate?.toLocaleDateString("pt-BR", {
                  day: "numeric",
                })}
              </span>
            </div>
            <div className={"flex items-center justify-center col-span-2"}>
              <span
                className={cn(
                  "text-destructive",
                  item.type === "INCOME" && "text-success"
                )}
              >
                {(item.amount / 100)?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <ActionButtons
                rowId={item.id}
                onEdit={() => onEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default DisplayRecurring;
