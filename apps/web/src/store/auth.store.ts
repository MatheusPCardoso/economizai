import { computed, makeObservable, observable, reaction, action } from "mobx";
import RootStore from "./root";
import axiosClient from "@lib/http.service";
import { makePersistable, isHydrated } from "mobx-persist-store";
import ManagerStore from "./manager.store";
import localforage from "localforage";

class Auth {
  id!: string;
  email!: string;
}

class AuthStore extends ManagerStore<Auth> {
  rootStore: RootStore;
  authToken: string | null = null;
  auth: Auth | null = null;

  constructor(rootStore: RootStore) {
    super(rootStore, { storeName: "Auth", modelClass: Auth });
    this.rootStore = rootStore;

    makeObservable(this, {
      authToken: observable,
      auth: observable,

      isHydrated: computed,

      setToken: action,
      setAuth: action,
      authenticate: action,
      logout: action,
    });

    makePersistable(this, {
      name: "authStore",
      properties: ["authToken", "auth"],
      storage: localforage,
    });
  }

  get isHydrated() {
    return isHydrated(this);
  }

  setToken(token: string | null) {
    this.authToken = token;
  }

  setAuth(auth: Auth | null) {
    this.auth = auth;
  }

  async authenticate(email: string, password: string) {
    try {
      const {
        data: { success, auth, token, wallets },
      } = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      this.setToken(token);
      this.create(auth);
      this.setAuth(auth);
      this.rootStore.walletStore.setWallets(wallets);
      return success;
    } catch (error) {
      console.error("Falha na autenticação:", error);
      throw error;
    }
  }

  async logout() {
    this.setToken(null);
    this.setAuth(null);
  }
}

export default AuthStore;
