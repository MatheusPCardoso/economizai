import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import RootStore from "./root";
import ManagerStore from "./manager.store";
import axiosClient from "@lib/http.service";

class Wallet {
  id!: string;
  name!: string;
}

class WalletStore extends ManagerStore<Wallet> {
  isHydrated: boolean = false;
  rootStore: RootStore;
  currentWalletId: string | null = null;

  constructor(store: RootStore) {
    super(store, { storeName: "Wallet", modelClass: Wallet });
    this.rootStore = store;

    makeObservable(this, {
      isHydrated: observable,
      currentWalletId: observable,

      wallet: computed,

      setWalletId: action,
      createWallet: action,
    });

    reaction(
      () => this.rootStore.authStore.auth?.id,
      (authId, prevValue) => {
        if (authId && authId !== prevValue) {
          this.initialLoad();
        }
      }
    );
  }

  async initialLoad(): Promise<void> {
    try {
      if (!this.rootStore.authStore.auth) return;
      const authId = this.rootStore.authStore.auth!.id;
      const { data } = await axiosClient.get<Wallet[]>("/wallet/authId", {
        params: {
          authId,
        },
      });
      if (!data) return;

      runInAction(() => {
        data.forEach((item: Wallet) => this.create(item));
        this.isHydrated = true;
        if (!data.length) return;
        this.setWalletId(data[0]!.id);
      });
    } catch (error) {
      console.error("Erro ao carregar carteiras:", error);
      throw error;
    }
  }

  get wallet() {
    return this.items.find((item) => item.id === this.currentWalletId);
  }

  async createWallet(name: string) {
    try {
      const { data } = await axiosClient.post("/wallet/create", {
        name,
        authId: this.rootStore.authStore.auth!.id,
      });

      runInAction(() => {
        this.create(data);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  setWalletId(id: string) {
    if (this.currentWalletId === id) return;
    this.currentWalletId = id;
  }

  setWallets(wallets: Wallet[]) {
    if (!wallets.length) return;
    this.createList(wallets);
    this.setWalletId(wallets[0]!.id);
  }
}

export default WalletStore;
