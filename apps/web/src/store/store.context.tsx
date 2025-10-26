"use client";

import React, { createContext, useContext } from "react";
import RootStore from "./root";
import { observer } from "mobx-react-lite";

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const store = new RootStore();
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const InitStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return children;
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore deve ser usado dentro de um StoreProvider");
  }
  return store;
};
