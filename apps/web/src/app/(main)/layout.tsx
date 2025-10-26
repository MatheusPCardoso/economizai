"use client";

import { observer } from "mobx-react-lite";

const MainLayout = observer(({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full h-screen">{children}</div>;
});

export default MainLayout;
