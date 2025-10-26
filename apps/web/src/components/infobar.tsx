"use client";

import { useStore } from "@store/store.context";
import { observer } from "mobx-react-lite";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export const InfoBar = observer(() => {
  const { authStore, walletStore } = useStore();
  const router = useRouter();
  return (
    <div className="h-[8vh] col-span-6 row-span-2 flex flex-row justify-between">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-3xl">Bem vindo de volta!</span>
        <span className="text-muted-foreground">
          É o melhor momento para controlar suas financas
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex cursor-pointer border-2 rounded-l-4xl rounded-r-2xl p-4 gap-2 items-center justify-center w-full h-full">
            <Avatar className="h-13 w-13">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{walletStore.wallet?.name}</span>
              <span className="text-muted-foreground" suppressHydrationWarning>
                {authStore.auth?.email}
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-60">
          {walletStore.items.length > 1 && (
            <>
              <DropdownMenuLabel>Minhas carteiras</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {walletStore.items.map((wallet) => (
                <DropdownMenuItem
                  key={wallet.id}
                  onClick={() => walletStore.setWalletId(wallet.id)}
                >
                  {wallet.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={() => router.push("/criacao-carteira")}>
            <Plus /> Nova carteira
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
