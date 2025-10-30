import RootStore from "./root";
import {
  action,
  computed,
  makeObservable,
  observable,
  override,
  reaction,
  toJS,
} from "mobx";
import axiosClient from "@lib/http.service";
import ManagerStore from "./manager.store";

export interface Month {
  incoming: number;
  expense: number;
  incomingPercent?: number;
  expensePercent?: number;
  balance: number;
}

export interface TransactionPerMonth {
  monthKey: string;
  label: string;
  data: Month;
}

export interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  expense: number;
  percent?: number;
}

export class Dashboard {
  id?: string;
  currentMonth!: Month;
  lastMonth!: Month;
  transactionPerMonth!: TransactionPerMonth[];
  expenseByCategoryTotal?: CategoryExpense[];
  expenseByCategoryCurrentMonth?: CategoryExpense[];
  expenseByCategoryMonthly?: CategoryExpense[];
  totalIncoming?: number;
  totalExpense?: number;
  generatedAt?: string;
}

class DashboardStore extends ManagerStore<Dashboard> {
  rootStore: RootStore;
  hydrated: boolean = false;
  constructor(rootStore: RootStore) {
    super(rootStore, { storeName: "Dashboard", modelClass: Dashboard });
    this.rootStore = rootStore;

    makeObservable(this, {
      setHydrated: action,

      create: override,
      update: override,

      hydrated: observable,
    });

    reaction(
      () => this.rootStore.walletStore.currentWalletId,
      (currentWalletId, prevValue) => {
        if (currentWalletId && prevValue !== currentWalletId) {
          this.initialLoad();
        }
      }
    );
  }

  get dashboardData(): Dashboard {
    return this.first;
  }

  async initialLoad() {
    try {
      if (!this.rootStore.walletStore.currentWalletId) return;
      const { data } = await axiosClient.get<Dashboard>(`/dashboard/wallet`, {
        params: {
          walletId: this.rootStore.walletStore.currentWalletId,
        },
      });
      if (!data) return;
      this.create(data);
      this.setHydrated();
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  setHydrated() {
    this.hydrated = true;
  }
}

export default DashboardStore;
