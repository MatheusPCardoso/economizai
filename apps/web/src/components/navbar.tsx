"use client";

import Logo from "./logo";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@store/store.context";
import {
  LayoutDashboard,
  Menu,
  RefreshCcw,
  Wallet,
  LogOut,
} from "lucide-react";
import { cn } from "@lib/utils";

const MenuItem = ({
  Icon,
  name,
  href,
}: {
  Icon: React.ReactNode;
  name: string;
  href: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="w-full flex justify-center">
      <div
        className={cn(
          "flex px-3 gap-3  items-center w-[85%] rounded-lg h-12 cursor-pointer hover:bg-muted",
          pathname.includes(href) && "bg-muted"
        )}
        onClick={() => router.push(href)}
      >
        {Icon}
        <p className="text-md font-semibold">{name}</p>
      </div>
    </div>
  );
};

const NavBar = () => {
  const { authStore } = useStore();
  const router = useRouter();
  const handleLogout = () => {
    authStore.logout();
    router.replace("/login");
  };
  const paths = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="text-primary" size={21} />,
      href: "/dashboard",
    },
    {
      name: "Lançamentos",
      icon: <Wallet className="text-primary" size={21} />,
      href: "/lancamento",
    },
    {
      name: "Recorrentes",
      icon: <RefreshCcw className="text-primary" size={21} />,
      href: "/recorrentes",
    },
    {
      name: "Categorias",
      icon: <Menu className="text-primary" size={21} />,
      href: "/categorias",
    },
  ];

  return (
    <div className="w-[280px] grid grid-rows-12 bg-sidebar h-screen">
      <div className="row-span-1 flex items-center justify-center">
        <Logo variant="wide" alt="Logo" width={170} />
      </div>
      <div className="row-span-10 flex flex-col items-center border-y-2 py-4 gap-1">
        <div className="text-md font-semibold w-full pl-4">MENU PRINCIPAL</div>
        {paths.map((path) => (
          <MenuItem
            key={path.name}
            Icon={path.icon}
            name={path.name}
            href={path.href}
          />
        ))}
      </div>
      <div className="row-span-1 flex flex-col items-center justify-center">
        <div
          className="flex px-3 gap-3 items-center w-[85%] rounded-lg h-12 cursor-pointer hover:bg-muted"
          onClick={() => handleLogout()}
        >
          <LogOut className="text-primary" size={21} />
          <p className="text-md font-semibold">Sair</p>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
