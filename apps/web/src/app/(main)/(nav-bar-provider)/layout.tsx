"use client";

import { InfoBar } from "@components/infobar";
import NavBar from "@components/navbar";
import { Separator } from "@components/ui/separator";
import { useStore } from "@store/store.context";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const SidebarLayout = observer(
  ({ children }: { children: React.ReactNode }) => {
    const store = useStore();
    const { authStore, walletStore } = store;
    const router = useRouter();
    const pathname = usePathname();

    const hydrated = authStore.isHydrated && walletStore.isHydrated;
    const auth = authStore.auth;
    const wallets = walletStore.items;

    useEffect(() => {
      if (!auth && hydrated) {
        router.push("/login");
      }

      if (
        hydrated &&
        wallets.length === 0 &&
        pathname !== "/criacao-carteira"
      ) {
        router.push("/criacao-carteira");
      }
    }, [hydrated, auth, router, wallets]);

    return (
      <div className="flex w-full h-screen">
        <NavBar />
        <div className="w-full overflow-auto p-4">
          <InfoBar />
          <Separator className="my-4" />
          <div className="w-full h-[85vh]">{children}</div>
        </div>
      </div>
    );
  }
);

export default SidebarLayout;
