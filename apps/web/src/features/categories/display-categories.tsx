"use client";

import DynamicIcon, { IconName } from "@components/dynamic-icon";
import { observer } from "mobx-react-lite";
import { useStore } from "@store/store.context";
import Image from "next/image";
import { Category } from "@store/category.store";
import ActionButtons from "@components/action-button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@lib/utils";

interface DisplayCategoriesProps {
  type: "incomes" | "expenses";
  onEdit: (transaction: Category) => void;
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

const DisplayCategories = observer(
  ({ type, onEdit }: DisplayCategoriesProps) => {
    const { categoryStore } = useStore();
    const [openSubcategoriesIds, setOpenSubcategoriesIds] = useState(
      new Set<string>()
    );
    const items = categoryStore[type];

    if (!items?.length) {
      return (
        <EmptyState
          img={`/assets/images/${type}.svg`}
          text={`Nenhuma categoria cadastrada`}
          imgWidth={type === "incomes" ? 220 : 350}
        />
      );
    }

    const handleDelete = (id: string) => categoryStore.deleteCategory(id);

    return (
      <div className="h-full w-full overflow-y-auto pr-2">
        {items.map((item) => {
          const category = categoryStore.getCategoryById(item?.id);
          const hasSubcategories = !!category?.subcategories?.length;
          return (
            <div key={item.id}>
              <div className="bg-secondary grid grid-cols-12 px-10 mb-3 h-14 rounded-lg">
                {hasSubcategories && (
                  <div
                    onClick={() => {
                      const newSet = new Set(openSubcategoriesIds);

                      newSet.has(item.id)
                        ? newSet.delete(item.id)
                        : newSet.add(item.id);

                      setOpenSubcategoriesIds(newSet);
                    }}
                    className="col-span-1 flex items-center justify-center cursor-pointer"
                  >
                    {openSubcategoriesIds.has(item.id) ? (
                      <ChevronRight className="text-primary" />
                    ) : (
                      <ChevronDown className="text-primary" />
                    )}
                  </div>
                )}
                <div className="col-span-1 flex items-center justify-center">
                  {category && <DynamicIcon name={category.icon as IconName} />}
                </div>
                <div
                  className={cn(
                    "flex flex-col items-start justify-center px-2 col-span-8",
                    !hasSubcategories && "col-span-9"
                  )}
                >
                  <span className="max-w-96 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <ActionButtons
                    rowId={item.id}
                    onEdit={() => onEdit(item)}
                    onDelete={
                      !item.isDefault ? () => handleDelete(item.id) : undefined
                    }
                  />
                </div>
              </div>
              {openSubcategoriesIds.has(item.id) && (
                <div className="flex flex-col items-end mb-5">
                  {item.subcategories?.map((subcategory, index) => (
                    <div
                      key={index}
                      className="bg-secondary grid grid-cols-12 px-10 mb-3 h-14 w-[95%] rounded-lg"
                    >
                      <div className="col-span-1 flex items-center justify-center">
                        <DynamicIcon name={subcategory.icon as IconName} />
                      </div>
                      <div className="flex flex-col items-start justify-center px-2 col-span-9">
                        <span className="max-w-96 overflow-hidden text-ellipsis whitespace-nowrap">
                          {subcategory.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

export default DisplayCategories;
