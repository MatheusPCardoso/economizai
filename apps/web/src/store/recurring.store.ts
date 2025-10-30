import { action, computed, makeObservable, reaction, runInAction } from "mobx";
import ManagerStore from "./manager.store";
import RootStore from "./root";
import axiosClient from "@lib/http.service";
import { TransactionType } from "@webTypes/transaction";

export class Recurring {
  id!: string;
  interval!: number;
  startDate!: Date;
  endDate?: Date;
  active!: boolean;
  lastGeneratedAt?: Date;
  name!: string;
  type!: TransactionType;
  amount!: number;
  createdAt!: string;
  categoryId!: string;
  subcategoryId?: string;
  walletId!: string;
  updatedAt!: string;
}

export class RecurringStore extends ManagerStore<Recurring> {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    super(rootStore, { storeName: "Recurring", modelClass: Recurring });
    this.rootStore = rootStore;

    makeObservable(this, {
      expenses: computed,
      incomes: computed,
      all: computed,

      createRecurring: action.bound,
      updateRecurring: action.bound,
      deleteRecurring: action.bound,
    });

    reaction(
      () => this.rootStore.walletStore.currentWalletId,
      (currentWalletId, prevValue) => {
        if (currentWalletId && prevValue !== currentWalletId) {
          this.resetObjects();
          this.initialLoad();
        }
      }
    );
  }

  async initialLoad(): Promise<void> {
    try {
      const { data } = await axiosClient.get<Recurring[]>(
        `/recurring/by-wallet/${this.rootStore.walletStore.currentWalletId}`
      );
      if (!data) return;

      runInAction(() => {
        data.forEach((item: Recurring) => this.create(item));
      });
    } catch (error) {
      console.error("Erro ao carregar transações recorrentes:", error);
      throw error;
    }
  }

  async createRecurring(data: {
    name: string;
    amount: number;
    interval: number;
    startDate: Date;
    type: "INCOME" | "EXPENSE";
    endDate?: Date;
    categoryId: string;
    subcategoryId?: string;
  }) {
    try {
      const { data: transaction } = await axiosClient.post<Recurring>(
        "/recurring",
        {
          ...data,
          walletId: this.rootStore.walletStore.currentWalletId,
          generateFirst: true,
        }
      );
      runInAction(() => this.create(transaction));
    } catch (error) {
      console.error("Erro ao criar transação recorrente:", error);
      throw error;
    }
  }

  async updateRecurring(data: Partial<Recurring>) {
    try {
      const { data: transaction } = await axiosClient.patch<Recurring>(
        `/recurring/${data.id}`,
        data
      );
      runInAction(() => this.update(transaction));
    } catch (error) {
      console.error("Erro ao atualizar transação recorrente:", error);
      throw error;
    }
  }

  get incomes() {
    return this.items.filter((item) => item.type === "INCOME");
  }

  get expenses() {
    return this.items.filter((item) => item.type === "EXPENSE");
  }

  get all() {
    return this.items;
  }

  async deleteRecurring(id: string) {
    try {
      await axiosClient.delete(`/recurring/${id}`);

      runInAction(() => {
        this.delete(id);
      });
    } catch (error) {
      console.error("Erro ao deletar transação recorrente:", error);
      throw error;
    }
  }
}
