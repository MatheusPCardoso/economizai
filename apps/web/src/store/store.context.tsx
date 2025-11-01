"use client";

import React, { createContext, useContext } from "react";
import RootStore, { rootStore } from "./root";

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore deve ser usado dentro de um StoreProvider");
  }
  return store;
};
