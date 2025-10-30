import { reaction } from "mobx";
import {
  isPersisting,
  makePersistable,
  stopPersisting,
} from "mobx-persist-store";
import { SerializableProperty } from "mobx-persist-store/lib/esm2017/serializableProperty";
import localforage from "localforage";
import ManagerStore from "../store/manager.store";

interface PersistableByWalletProps<T> {
  store: ManagerStore<T>;
  storeName: string;
  properties: string[];
}

export const makePersistableByWallet = <T>({
  store,
  storeName,
  properties,
}: PersistableByWalletProps<T>) => {
  reaction(
    () => store.rootStore.walletStore?.currentWalletId,
    (walletId: string | null) => {
      if (walletId) {
        if (isPersisting(store)) stopPersisting(store);

        makePersistable(store, {
          name: `${storeName}:${walletId}`,
          properties: properties.map((prop) => ({
            key: prop as keyof ManagerStore<T>,
            serialize: (value: any) => {
              if (Array.isArray(value)) {
                return value.map((item) => {
                  const { root, ...rest } = item;
                  return root ? rest : item;
                });
              }

              const { root, ...rest } = value;
              return root ? rest : value;
            },
            deserialize: (value: any) => {
              if (Array.isArray(value)) {
                return value
                  .map((data) => store.getInstanceData(data))
                  .filter((data) => data);
              }

              return store.getInstanceData(value) || {};
            },
          })) as SerializableProperty<ManagerStore<T>, keyof ManagerStore<T>>[],
          storage: localforage,
        });
      }
    },
    { fireImmediately: true }
  );
};
