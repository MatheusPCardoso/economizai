import AuthStore from "./auth.store";
import CategoryStore from "./category.store";
import WalletStore from "./wallet.store";
import DashboardStore from "./dashboard.store";
import { TransactionStore } from "./transaction.store";
import { RecurringStore } from "./recurring.store";
import { makeObservable, observable } from "mobx";

class RootStore {
  initilized: boolean = false;
  authStore: AuthStore;
  walletStore: WalletStore;
  categoryStore: CategoryStore;
  dashboardStore: DashboardStore;
  transactionStore: TransactionStore;
  recurringStore: RecurringStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.walletStore = new WalletStore(this);
    this.categoryStore = new CategoryStore(this);
    this.dashboardStore = new DashboardStore(this);
    this.transactionStore = new TransactionStore(this);
    this.recurringStore = new RecurringStore(this);

    makeObservable(this, {
      initilized: observable,
    });
  }
}

export const rootStore = new RootStore();

export default RootStore;
