import { action, computed, makeObservable, observable } from "mobx";
import RootStore from "./root";
import { reviveDatesInObject } from "@helpers/revive-date";
import { makePersistableByWallet } from "../helpers/persist-by-wallet";

type ConstructorFor<T> = { new (root: RootStore): T };

class ManagerStore<T extends { id?: string } = { id?: string }> {
  _objects: T[] = [];

  rootStore: RootStore;
  ModelClass?: ConstructorFor<T>;
  private isCollection: boolean = true;

  constructor(
    rootStore: RootStore,
    options: {
      storeName: string;
      isCollection?: boolean;
      modelClass?: ConstructorFor<T>;
    }
  ) {
    this.rootStore = rootStore;
    this.ModelClass = options.modelClass;

    if (options) {
      const { isCollection } = options;

      if (isCollection) this.isCollection = isCollection;
    }

    makeObservable(this, {
      _objects: observable,
      items: computed,
      first: computed,
      initialLoad: action,
      create: action.bound,
      createList: action.bound,
      update: action.bound,
      updateList: action.bound,
      delete: action.bound,
      resetObjects: action.bound,
    });

    makePersistableByWallet({
      store: this,
      properties: ["_objects"],
      storeName: options.storeName,
    });
  }

  get items() {
    return this._objects;
  }

  get first() {
    return this._objects[0];
  }

  async initialLoad() {}

  create(data: T) {
    this.update(data);
  }

  createList(data: T[]) {
    this.updateList(data);
  }

  update(data: T) {
    const instanceData = this.getInstanceData(data) ?? data;

    if (!this.isCollection) this._objects = [instanceData];

    const objects = this._objects as T[];

    const dataIndex = objects.findIndex((item) => item.id === instanceData.id);

    if (dataIndex === -1) {
      this._objects = [instanceData, ...this._objects];
      return;
    }

    this._objects = this._objects.map((item, idx) =>
      idx === dataIndex ? instanceData : item
    );
  }

  updateList(data: T[]) {
    const objectMap = new Map(this._objects?.map((item) => [item.id, item]));

    for (const item of data) {
      const instanceData = this.getInstanceData(item) ?? item;
      if (instanceData.id) {
        objectMap.set(instanceData.id, instanceData);
      }
    }

    this._objects = Array.from(objectMap.values());
  }

  delete(id: string) {
    this._objects = this._objects.filter((item) => item.id !== id);
  }

  getInstanceData(data: T): T | null {
    if (!this.ModelClass) return data;

    const revived = reviveDatesInObject(data);
    const instance = new this.ModelClass(this.rootStore);

    for (const [key, value] of Object.entries(revived)) {
      const hasGetter = Object.getOwnPropertyDescriptor(
        this.ModelClass.prototype,
        key
      )?.get;

      if (!hasGetter) {
        (instance as Record<string, any>)[key] = value;
      }
    }

    return instance;
  }

  resetObjects() {
    this._objects = [];
  }
}

export default ManagerStore;
