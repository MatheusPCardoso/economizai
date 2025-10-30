import { action, computed, makeObservable, reaction, runInAction } from "mobx";
import ManagerStore from "./manager.store";
import RootStore from "./root";
import axiosClient from "@lib/http.service";
import { TransactionType } from "../../types/transaction";

export class Transaction {
  id!: string;
  name!: string;
  type!: TransactionType;
  amount!: number;
  createdAt!: string;
  recurring!: boolean;
  reference!: Date;
  categoryId!: string;
  subcategoryId?: string;
  walletId!: string;
  updatedAt!: string;
}

export class TransactionStore extends ManagerStore<Transaction> {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    super(rootStore, { storeName: "Transaction", modelClass: Transaction });
    this.rootStore = rootStore;

    makeObservable(this, {
      loadTransactions: action,
      createTransaction: action.bound,
      updateTransaction: action.bound,
      deleteTransaction: action,

      expenses: computed,
      incomes: computed,
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
      if (!this.rootStore.walletStore.currentWalletId) return;
      const { data } = await axiosClient.get<Transaction[]>(
        `/transactions/wallet/${this.rootStore.walletStore.currentWalletId}`
      );
      if (!data) return;
      data.map((item: Transaction) => this.create(item));
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  }

  async loadTransactions(walletId: string) {
    try {
      const { data } = await axiosClient.get<Transaction[]>(
        `/transaction/wallet/balanced`
      );
      if (!data) return;
      data.map((item: Transaction) => this.create(item));
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  }

  async createTransaction(data: Partial<Transaction>) {
    try {
      const { data: transaction } = await axiosClient.post("/transactions", {
        ...data,
        walletId: this.rootStore.walletStore.currentWalletId,
        reference: new Date(),
      });
      runInAction(() => this.create(transaction));
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    }
  }

  async updateTransaction({ id, ...data }: Partial<Transaction>) {
    try {
      const { data: transaction } = await axiosClient.put(
        `/transactions/${id}`,
        data
      );
      runInAction(() => this.update(transaction));
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
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

  async deleteTransaction(id: string) {
    try {
      await axiosClient.delete(`/transactions/${id}`);
      this.delete(id);
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
    }
  }
}
